import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { CollectionFieldDto, CollectionRecordDto, CreateCollectionItemRequestDto, CreateCollectionRequestDto, GetCollectionRequest, GetCollectionsRequestDto, GetUserCollectionsRequestDto } from './dto/collection.dto';
import { CollectionField } from './models/collection.field';
import { CollectionItem } from './models/collection.item';
import { CollectionFieldValue, CollectionFieldValueCreationAttributes } from './models/collection.field.value';
import { GoogleDriveService } from '../google-drive/google.service';
import { Theme } from 'src/theme/model/theme.model';

@Injectable()
export class CollectionService {

    constructor(
        @InjectModel(Collection) private collectionRepository: typeof Collection,
        @InjectModel(CollectionField) private collectionFieldRepository: typeof CollectionField,
        @InjectModel(CollectionItem) private collectionItemRepository: typeof CollectionItem,
        @InjectModel(CollectionFieldValue) private collectionFieldValuesRepository: typeof CollectionFieldValue,
        @InjectModel(Theme) private themeRepository: typeof Theme,
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
    }
    
    async getCollectionsWithPagination(dto: GetCollectionsRequestDto) {
        const _offset = (dto.page - 1) * dto.recordsCount;
        const _collections = this.collectionRepository.findAndCountAll({
            offset: _offset,
            limit: dto.recordsCount,
            include: { model: CollectionItem, as: 'items' }
        })
        const rawCollections = (await _collections).rows;
        const collectionRecordDto: CollectionRecordDto[] = []; 
        let _themes = await this.themeRepository.findAll();
        console.log(JSON.stringify(rawCollections, null))
        rawCollections.forEach(item => {
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
    
    async getCollectionById(dto: GetCollectionRequest) {
        const collection = await this.collectionRepository.findByPk(dto.id);
        const collectionItems = await this.getCollectionItems(dto.id)
        const collectionFields = await this.getCollectionFields(dto.id)
        return {collection, collectionItems, collectionFields};
    }

    async getUserCollections(dto: GetCollectionsRequestDto, userId: number) {
        const _offset = (dto.page - 1) * dto.recordsCount;
        const _collections = this.collectionRepository.findAndCountAll({
            where: {userId: userId},
            offset: _offset,
            limit: dto.recordsCount,
            include: [{ model: CollectionItem }]
        })
        const rawCollections = (await _collections).rows;
        const collectionRecordDto: CollectionRecordDto[] = []; 
        let _themes = await this.themeRepository.findAll();
        rawCollections.forEach(item => {
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

    async getCollectionDirectories() {
        const themes = await this.themeRepository.findAll();
        const types = [
            {value: 'INTEGER', label: 'Number'},
            {value: 'VARCHAR', label: 'String'},
            {value: 'BOOLEAN', label: 'Logical'},
            {value: 'DECIMAL', label: 'Money'},
        ];
        return { themes, types}
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
            include: {model: CollectionFieldValue}
        })
        return collectionItems;
    }
}