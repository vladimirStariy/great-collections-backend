import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { CollectionFieldAndValueDto, CollectionFieldDto, CollectionRecordDto, CreateCollectionItemRequestDto, CreateCollectionRequestDto, GetCollectionItemResponse, GetCollectionRequest, GetCollectionsRequestDto, GetUserCollectionsRequestDto } from './dto/collection.dto';
import { CollectionField } from './models/collection.field';
import { CollectionItem } from './models/collection.item';
import { CollectionFieldValue, CollectionFieldValueCreationAttributes } from './models/collection.field.value';
import { GoogleDriveService } from '../google-drive/google.service';
import { Theme } from 'src/theme/model/theme.model';
import { UserService } from 'src/user/user.service';
import { Favorites } from './models/favorite.model';
import { Tag } from 'src/tag/model/tag.model';
import { CollectionItemTag } from 'src/tag/model/collection.item.tag';

@Injectable()
export class CollectionService {

    constructor(
        @InjectModel(Collection) private collectionRepository: typeof Collection,
        @InjectModel(CollectionField) private collectionFieldRepository: typeof CollectionField,
        @InjectModel(CollectionItem) private collectionItemRepository: typeof CollectionItem,
        @InjectModel(CollectionFieldValue) private collectionFieldValuesRepository: typeof CollectionFieldValue,
        @InjectModel(Favorites) private favoritesRepository: typeof Favorites, 
        @InjectModel(Theme) private themeRepository: typeof Theme,
        @InjectModel(Tag) private tagRepository: typeof Tag,
        @InjectModel(CollectionItemTag) private collectionItemTagRepository: typeof CollectionItemTag,
        private userService: UserService,
        private readonly googleDriveService: GoogleDriveService
    ) {}

    private async uploadImage(file: Express.Multer.File) {
        const GOOGLE_DRIVE_FOLDER_ID = '1z-0Qp-NsDHX81lVjv47JTwqrBrO3Bil-';
        const imageUrl = await this.googleDriveService.uploadFile(
            file,
            GOOGLE_DRIVE_FOLDER_ID,
        );
        return { imageUrl };
    }

    async createCollection(collectionDto: CreateCollectionRequestDto, userId: number, file: Express.Multer.File) {
        if(file) {
            const response = await this.uploadImage(file);
            collectionDto.imagePath = response.imageUrl;
        } 
        const created = await this.collectionRepository.create({
            name: collectionDto.name, 
            description: collectionDto.description,
            themeId: collectionDto.theme,
            imagePath: collectionDto.imagePath,
            userId: userId
        });
        collectionDto.fields.map((item, index) => {collectionDto.fields[index].collectionId = created.id})
        await this.createCollectionFields(collectionDto.fields);
        return created.id;
    }

    async createCollectionItem(collectionItemDto: CreateCollectionItemRequestDto) {
        const created = await this.collectionItemRepository.create({
            name: collectionItemDto.name, 
            collection_id: collectionItemDto.collectionId
        });
        await this.createCollectionItemFieldsValues(collectionItemDto.collectionId, created.id, collectionItemDto.values);
        let arr: {id: number, name: string}[] = [];
        let existedTags: {collectionItemId: number, tagId: number}[] = []; 
        collectionItemDto.tags.map(async (item) => {
            if(item.id === 0) arr.push(item)
            else existedTags.push({collectionItemId: created.id, tagId: item.id}); 
        })
        await this.collectionItemTagRepository.bulkCreate(existedTags);
        await this.createItemTags(arr, created.id)
    }
    
    
    async getBiggestCollections(count: number) {
        const _collections = await this.collectionRepository.findAll({
            include: { model: CollectionItem }
        });
        let arr = _collections.sort((a, b) => {
            if(a.items.length < b.items.length) return 1;
            if(a.items.length > b.items.length) return -1;
            return 0;
        })
        const collectionRecordDto = await this.mapCollectionToCollectionDto(arr);
        return collectionRecordDto.slice(0, count);
    }

    async getLastCollectionItems(count: number) {
        const _collectionItems = await this.collectionItemRepository.findAll({
            include: {model: Tag}
        });
        let collectionItemsRecords: {id: number, name: string, created: Date, tags: {id: number, name: string}[]}[] = []
        _collectionItems.map((item) => {
            let tagArr: {id: number, name: string}[] = [];
            item.tags.map((tag) => { tagArr.push({id: tag.id, name: tag.name}) })
            collectionItemsRecords.push({id: item.id, name: item.name, created: item.createdAt, tags: tagArr})
        })
        collectionItemsRecords = collectionItemsRecords.sort((a,b) => a.created.getDate() - b.created.getDate()).reverse()
        return collectionItemsRecords.slice(0, count)
    }

    async getCollectionsWithPagination(dto: GetCollectionsRequestDto) {
        const _offset = (dto.page - 1) * dto.recordsCount;
        const _collections = this.collectionRepository.findAndCountAll({
            offset: _offset,
            limit: dto.recordsCount,
            include: { model: CollectionItem, as: 'items' }
        })
        const rawCollections = (await _collections).rows;
        const collectionRecordDto = await this.mapCollectionToCollectionDto(rawCollections);
        return collectionRecordDto;
    }
    
    async getCollectionById(dto: GetCollectionRequest, user: {email: string, userId: number} | false) {
        const collection = await this.collectionRepository.findByPk(dto.id);
        const collectionItems = await this.getCollectionItems(dto.id)
        const collectionFields = await this.getCollectionFields(dto.id)
        if(!user) {
            return {collection, collectionItems, collectionFields, mode: 'watch'};
        } else {
            const isAdmin = (await this.userService.getById(user.userId)).isAdmin;
            if(user.userId !== collection.userId && !isAdmin) {
                return {collection, collectionItems, collectionFields, mode: 'watch'};
            } 
            if(user.userId === collection.userId || isAdmin) {
                return {collection, collectionItems, collectionFields, mode: 'edit'};
            }
        }
    }

    async getLikes(collectionItemId: number) {
        const likes = await this.favoritesRepository.findAndCountAll({
            where: { collectionItemId: collectionItemId }
        })
        return likes.count;
    }

    async likeItem(collectionItemId: number, email: string) {
        const userId = (await this.userService.getByEmail(email)).id;
        await this.favoritesRepository.create({collectionItemId: collectionItemId, userId: userId});
    }

    async unlikeItem(collectionItemId: number, email: string) {
        const userId = (await this.userService.getByEmail(email)).id;
        await this.favoritesRepository.destroy({where: {collectionItemId: collectionItemId, userId: userId}});
    }

    async checkLiked(collectionItemId: number, email: string) {
        const userId = (await this.userService.getByEmail(email)).id;
        const match = await this.favoritesRepository.findOne({where: {userId: userId, collectionItemId: collectionItemId}})
        if(match) return true
        else return false
    }

    async getCollectionsByUserId(userId: number) {
        const rawCollections = await this.collectionRepository.findAll({
            where: {userId: userId},
            include: [{ model: CollectionItem }]
        })
        const collections = await this.mapCollectionToCollectionDto(rawCollections);
        return collections;
    }

    async getAllCollections() {
        const collections = await this.collectionRepository.findAndCountAll({
            include: { model: CollectionItem }
        });
        const rawCollections = (await collections).rows;
        const collectionRecordDto = await this.mapCollectionToCollectionDto(rawCollections);
        return {collections: collectionRecordDto, total: rawCollections.length}
    }

    async getCollectionDirectories() {
        const themes = await this.themeRepository.findAll();
        const types = [
            {value: 'INTEGER', label: 'Number'},
            {value: 'VARCHAR', label: 'String'},
            {value: 'BOOLEAN', label: 'Logical'},
            {value: 'BIGTEXT', label: 'Big text'},
            {value: 'DATE', label: 'Date'}
        ];
        return { themes, types}
    }

    async getCollectionItemById(ids: number[]) {
        const collectionItems = await this.collectionItemRepository.findAll({
            where: { id: ids },
            include: { model: CollectionFieldValue }
        })
        return collectionItems;
    }

    async getSingleCollectionItemById(id: number, user: {email: string, userId: number} | false) {
        const collectionItem = await this.collectionItemRepository.findOne({
            where: { id: id },
            include: [
                { model: CollectionFieldValue },
                { model: Collection }
            ]
        })
        const collectionFields = await this.getCollectionFields(collectionItem.collection_id);
        let collectionFieldsValues: CollectionFieldAndValueDto[] = [];
        collectionFields.map((field) => {
            collectionItem.values.map((fieldValue) => {
                if(fieldValue.collectionFieldId === field.id) {
                    collectionFieldsValues.push({name: field.name, value: fieldValue.value, data_type: field.data_type})
                }
            })
        }); 
        let collectionItemDto: GetCollectionItemResponse = {
            id: collectionItem.id,
            collection_id: collectionItem.collection_id,
            name: collectionItem.name,
            collection: { name: collectionItem.collection.name },
            collectionFields: collectionFieldsValues
        }
        return collectionItemDto;
    }

    private async createItemTags(rawTags: {id: number, name: string}[], collectionItemId: number) {
        const createdTags = await this.tagRepository.bulkCreate(rawTags);
        let arr: {collectionItemId: number, tagId: number}[] = [];
        createdTags.map((item) => {
            arr.push({collectionItemId: collectionItemId, tagId: item.id});
        })
        await this.collectionItemTagRepository.bulkCreate(arr);
    }

    private async mapCollectionToCollectionDto (collections: Collection[]) {
        const collectionRecordDto: CollectionRecordDto[] = []; 
        let _themes = await this.themeRepository.findAll();
        collections.forEach(item => {
            collectionRecordDto.push({
                id: item.id, 
                name: item.name, 
                themeId: item.themeId, 
                theme: _themes.find(elem => elem.id === item.themeId).name, 
                imagePath: item.imagePath, 
                itemsQuantity: item.items.length
            })
        })
        return collectionRecordDto;
    }

    private async createCollectionItemFieldsValues(collectionId: number, collectionItemId: number, data: any[]) {
        const fields = await this.getCollectionFields(collectionId);
        let arr: CollectionFieldValueCreationAttributes[] = [];
        fields.map((item, index) => arr.push({
            collectionFieldId: item.id, 
            collectionItemId: collectionItemId, 
            value: data[index].value
        }))
        await this.collectionFieldValuesRepository.bulkCreate(arr);      
    }
    
    private async createCollectionFields(fields: CollectionFieldDto[]) {
        await this.collectionFieldRepository.bulkCreate(fields);
    }
    
    private async getCollectionFields(collectionId: number) {
        const collectionFields = await this.collectionFieldRepository.findAll({
            where: {
                collectionId: collectionId
            },
        })
        return collectionFields;
    } 

    private async getCollectionItems(collectionId: number) {
        const collectionItems = await this.collectionItemRepository.findAll({
            where: {
                collection_id: collectionId
            },
            include: [
                {model: CollectionFieldValue},
                {model: Favorites}
            ]
        })
        return collectionItems;
    }
}