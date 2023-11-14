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
import { User } from 'src/user/models/user.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([
        User,
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
