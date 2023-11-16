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
import { UserModule } from 'src/user/user.module';
import { Theme } from 'src/theme/model/theme.model';
import { ThemeModule } from 'src/theme/theme.module';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ThemeModule),
    SequelizeModule.forFeature([
        User,
        Collection, 
        CollectionField, 
        CollectionItem, 
        CollectionFieldValue, 
        CollectionItemTag, 
        Tag,
        Theme 
    ])
  ],
  exports: [
    CollectionService
  ]
})

export class CollectionModule {}
