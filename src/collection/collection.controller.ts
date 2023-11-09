import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionItemRequestDto, CreateCollectionRequestDto } from './dto/collection.dto';

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

    @Get('/collections')
    async getCollections() {
        const response = await this.collectionService.getCollectionsWithPagination();
        return response;
    }
}
