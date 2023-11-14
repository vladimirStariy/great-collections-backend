import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, BadRequestException } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionItemRequestDto, CreateCollectionRequestDto, GetCollectionsRequestDto } from './dto/collection.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.auth.guard';

@Controller('')
export class CollectionController {

    constructor(private collectionService: CollectionService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create-collection')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
        fileFilter: (req, file, callback) => {
            return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
            ? callback(null, true)
            : callback(new BadRequestException('Only image files are allowed'), false);
        }
    })) 
    async createCollection(@UploadedFile() file: Express.Multer.File, @Body() collectionDto: CreateCollectionRequestDto) {
        collectionDto.fields.map((item, index) => {
            collectionDto.fields[index] = JSON.parse(String(collectionDto.fields[index]))
        })
        const response = await this.collectionService.createCollection(collectionDto, file);
        return response;
    }

    @UseGuards(JwtAuthGuard)
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
