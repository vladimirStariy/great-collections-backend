import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { CollectionFieldDto, CreateCollectionItemRequestDto, CreateCollectionRequestDto } from './dto/collection.dto';
import { CollectionField } from './models/collection.field';
import { CollectionItem } from './models/collection.item';
import { CollectionFieldValue } from './models/collection.field.value';

@Injectable()
export class CollectionService {

    constructor(
        @InjectModel(Collection) private collectionRepository: typeof Collection,
        @InjectModel(CollectionField) private collectionFieldRepository: typeof CollectionField,
        @InjectModel(CollectionItem) private collectionItemRepository: typeof CollectionItem,
        @InjectModel(CollectionFieldValue) private collectionFieldValuesRepository: typeof CollectionFieldValue
    ) {}

    async createCollection(collectionDto: CreateCollectionRequestDto) {
        const created = await this.collectionRepository.create(collectionDto.collectionData);
        collectionDto.fields.map((item, index) => {collectionDto.fields[index].collectionId = created.id})
        await this.createCollectionFields(collectionDto.fields);
    }

    async createCollectionItem(collectionItemDto: CreateCollectionItemRequestDto) {
        const created = await this.collectionItemRepository.create({
            name: collectionItemDto.name, 
            collection_id: collectionItemDto.collectionId
        });
        await this.createCollectionItemFieldsValues(collectionItemDto);
    }

    private async createCollectionFields(fields: CollectionFieldDto[]) {
        await this.collectionFieldRepository.bulkCreate(fields);
    }

    private async createCollectionItemFieldsValues(collectionItemDto: CreateCollectionItemRequestDto) {
        const fields = await this.getCollectionFields(collectionItemDto.collectionId);
        
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

