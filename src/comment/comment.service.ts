import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';
import { CreateCommentRequest } from './dto/comment.dto';
import { User } from 'src/user/models/user.model';

export interface CommentDto {
    id: number, 
    text: string, 
    username: string, 
    createdDate: Date
}

@Injectable()
export class CommentService {

    constructor(@InjectModel(Comment) private commentRepository: typeof Comment) {}

    async createComment(dto: CreateCommentRequest) {
        const created = await this.commentRepository.create(dto)
        return created;
    }

    async getCommentsByItemId(collectionItemId: number) {
        const comments = await this.commentRepository.findAll({where: {collectionItemId: collectionItemId}, include: {model: User}});
        let commentsDto: CommentDto[] = [];
        if(comments) comments.forEach(item => commentsDto.push({id: item.id, text: item.text, username: item.user.name , createdDate: item.createdAt}))
        return commentsDto;
    }

    async getCommentById(commentId: number) {
        const comment = await this.commentRepository.findOne({where: {id: commentId}, include: {model: User}});
        return {id: comment.id, text: comment.text, username: comment.user.name, createdDate: comment.createdAt}
    }
}