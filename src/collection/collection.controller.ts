import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionItemRequestDto, CreateCollectionRequestDto, GetCollectionsRequestDto } from './dto/collection.dto';

@Controller('')
export class CollectionController {

    constructor(private collectionService: CollectionService) {}

    @Post('/create-collection')
    async createCollection(@Body() collectionDto: CreateCollectionRequestDto) {
        await this.collectionService.createCollection(collectionDto);
    }

    @Post('/create-collection-item')
    async createCollectionItem(@Body() collectionItemDto: CreateCollectionItemRequestDto) {
        await this.collectionService.createCollectionItem(collectionItemDto);
    }

    @Post('/collections')
    async getCollections(@Body() dto: GetCollectionsRequestDto) {
        const response = await this.collectionService.getCollectionsWithPagination(dto);
        return response;
    }
}
