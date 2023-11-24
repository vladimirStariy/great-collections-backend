import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagRequest } from './dto/tag.dto';

@Controller('')
export class TagController {

    constructor(private tagService: TagService) {}

    @Get('tags')
    async getTags(@Body() dto: CreateTagRequest) {
        const response = await this.tagService.getAllTags();
        return {tags: response};
    }
}
