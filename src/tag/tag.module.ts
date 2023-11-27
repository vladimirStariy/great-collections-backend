import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tag } from './model/tag.model';
import { CollectionItem } from 'src/collection/models/collection.item';
import { CollectionItemTag } from './model/collection.item.tag';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [
    SequelizeModule.forFeature([Tag, CollectionItem, CollectionItemTag]),
  ],
  exports: [
    TagService
  ]
})

export class TagModule {}
