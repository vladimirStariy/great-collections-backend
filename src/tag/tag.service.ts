import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './model/tag.model';

@Injectable()
export class TagService {

    constructor(@InjectModel(Tag) private tagRepository: typeof Tag) {}

    
}