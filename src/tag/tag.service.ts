import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './model/tag.model';
import { CreateTagRequest } from './dto/tag.dto';

@Injectable()
export class TagService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag) {}

    async getAllTags() {
        const tags = await this.tagRepository.findAll();
        let tagDto: {id: number, name: string}[] = [];
        tags.forEach(x => tagDto.push({id: x.id, name: x.name}));
        return tagDto;
    }
}