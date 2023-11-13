import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { CollectionFieldDto, CollectionRecordDto, CreateCollectionItemRequestDto, CreateCollectionRequestDto, GetCollectionsRequestDto } from './dto/collection.dto';
import { CollectionField } from './models/collection.field';
import { CollectionItem } from './models/collection.item';
import { CollectionFieldValue, CollectionFieldValueCreationAttributes } from './models/collection.field.value';
import { GoogleDriveService } from '../google-drive/google.service';

@Injectable()
export class CollectionService {

    constructor(
        @InjectModel(Collection) private collectionRepository: typeof Collection,
        @InjectModel(CollectionField) private collectionFieldRepository: typeof CollectionField,
        @InjectModel(CollectionItem) private collectionItemRepository: typeof CollectionItem,
        @InjectModel(CollectionFieldValue) private collectionFieldValuesRepository: typeof CollectionFieldValue,
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

    async createCollection(collectionDto: CreateCollectionRequestDto, file: Express.Multer.File) {
        const response = await this.uploadImage(file);
        collectionDto.collectionData.imagePath = response.imageUrl;
        const created = await this.collectionRepository.create(collectionDto.collectionData);
        collectionDto.fields.map((item, index) => {collectionDto.fields[index].collectionId = created.id})
        await this.createCollectionFields(collectionDto.fields);
    }

    async createCollectionItem(collectionItemDto: CreateCollectionItemRequestDto) {
        const created = await this.collectionItemRepository.create({
            name: collectionItemDto.name, 
            collection_id: collectionItemDto.collectionId
        });
        await this.createCollectionItemFieldsValues(collectionItemDto.collectionId, created.id, collectionItemDto.data);
    }
    
    async getCollectionsWithPagination(dto: GetCollectionsRequestDto) {
        const _offset = (dto.page - 1) * dto.recordsCount;
        const _collections = this.collectionRepository.findAndCountAll({
            offset: _offset,
            limit: dto.recordsCount,
            include: [{ model: CollectionItem }]
        })
        const rawCollections = (await _collections).rows;
        const collectionRecordDto: CollectionRecordDto[] = []; 
        rawCollections.forEach(item => collectionRecordDto.push({id: item.id, name: item.name, theme: item.theme, itemsQuantity: item.items.length}))
        return collectionRecordDto;
    }
    
    private async createCollectionItemFieldsValues(collectionId: number, collectionItemId: number, data: any[]) {
        const fields = await this.getCollectionFields(collectionId);
        let arr: CollectionFieldValueCreationAttributes[] = [];
        fields.map((item, index) => arr.push({
            collectionFieldId: item.id, 
            collectionItemId: collectionItemId, 
            value: data[index]
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
            }
        })
        return collectionFields;
    } 
}

