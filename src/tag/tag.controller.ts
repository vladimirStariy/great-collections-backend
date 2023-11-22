import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagRequest } from './dto/tag.dto';

@Controller('')
export class TagController {

    constructor(private tagService: TagService) {}

    @Post('tags')
    async createTag(@Body() dto: CreateTagRequest) {
        const response = await this.tagService.createTag(dto);
    }

}
