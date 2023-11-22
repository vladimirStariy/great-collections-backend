import { HttpException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';
import { CreateCommentRequest } from './dto/comment.dto';

@Injectable()
export class CommentService {

    constructor(@InjectModel(Comment) private commentRepository: typeof Comment) {}

    async createComment(dto: CreateCommentRequest) {
        const created = await this.commentRepository.create(dto)
        return created;
    }

    async getCommentsByItemId(collectionItemId: number) {
        const comments = await this.commentRepository.findAll({where: {collectionItemId: collectionItemId}});
        return comments;
    }

}