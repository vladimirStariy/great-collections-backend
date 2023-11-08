import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('')
export class TagController {

    constructor(private tagService: TagService) {}

}
