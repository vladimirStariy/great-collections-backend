import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from './models/collection.model';
import { Tag } from 'src/tag/model/tag.model';
import { CollectionItem } from './models/collection.item';
import { CollectionItemTag } from 'src/tag/model/collection.item.tag';
import { CollectionField } from './models/collection.field';
import { CollectionFieldValue } from './models/collection.field.value';
import { GoogleDriveService } from 'src/google-drive';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports: [
    SequelizeModule.forFeature([
        Collection, 
        CollectionField, 
        CollectionItem, 
        CollectionFieldValue, 
        CollectionItemTag, 
        Tag, 
    ])
  ],
  exports: [
    CollectionService
  ]
})

export class CollectionModule {}
