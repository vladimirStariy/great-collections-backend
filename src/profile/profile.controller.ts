import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/my-collections')
    async getMyCollections(@Req() req: any) {
        const collections = await this.profileService.getUserCollections(req.user.userId)
        return collections;
    }

    @UseGuards(JwtAuthGuard) 
    @Post('/like-item')
    async likeItem(@Req() req: any, @Body() collectionItemId: number) {
        await this.profileService.likeCollectionItem(req.user.userId, collectionItemId);
        return 'ok';
    }

    @UseGuards(JwtAuthGuard) 
    @Post('/unlike-item')
    async unlikeItem(@Req() req: any, @Body() collectionItemId: number) {
        await this.profileService.unlikeCollectionItem(req.user.userId, collectionItemId);
        return 'ok';
    }
}
