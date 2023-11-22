import { Body, Controller, Delete, Get, Req, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateCommentRequest } from './dto/comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {

    constructor(private commentService: CommentService) {}

    
}
