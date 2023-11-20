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
}
