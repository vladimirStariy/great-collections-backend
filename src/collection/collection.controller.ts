import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, BadRequestException } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionItemRequestDto, CreateCollectionRequestDto, GetCollectionsRequestDto } from './dto/collection.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtUserGuard } from 'src/auth/guards/jwt.user';
import { UserGuard } from 'src/auth/guards/user.guard';


@Controller('collection')
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
    async createCollection(@Req() req: any,
                           @UploadedFile('file') file: Express.Multer.File, 
                           @Body() collectionDto: CreateCollectionRequestDto) {
        collectionDto.fields.map((item, index) => {
            collectionDto.fields[index] = JSON.parse(String(collectionDto.fields[index]))
        })
        const response = await this.collectionService.createCollection(collectionDto, req.user.userId, file);
        return response;
    }

    @Post('/create-collection-item')
    async createCollectionItem(@Body() collectionItemDto: CreateCollectionItemRequestDto) {
        await this.collectionService.createCollectionItem(collectionItemDto);
    }

    @UseGuards(UserGuard)
    @Get('/getCollectionData/:collectionId')
    async getCollection(@Req() req: any, @Param('collectionId') collectionId: number) {
        const response = await this.collectionService.getCollectionById({ id: collectionId }, req.user);
        return response;
    }

    @UseGuards(UserGuard)
    @Get('getCollectionItem/:collectionItemId')
    async getCollectionItem(@Req() req: any, @Param('collectionItemId') collectionItemId: number) {
        const response = await this.collectionService.getSingleCollectionItemById(collectionItemId, req.user);
        return response;
    }

    @Get('/collections')
    async getAllCollections() {
        const response = await this.collectionService.getAllCollections();
        return response;
    }

    @Get('/collection-directories')
    async getCollectionDirectories() {
        console.log('THATS RIGHT')
        const response = await this.collectionService.getCollectionDirectories();
        return response;
    }

    @Delete('/delete-collection')
    async deleteCollection() {
        
    }
}