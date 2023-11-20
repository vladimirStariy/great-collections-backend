import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { CollectionItem } from 'src/collection/models/collection.item';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Favorites } from 'src/collection/models/favorite.model';
import { Collection } from 'src/collection/models/collection.model';
import { CollectionModule } from 'src/collection/collection.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    forwardRef(() => CollectionModule),
    SequelizeModule.forFeature([Favorites, CollectionItem, Collection]),
  ],
  exports: [
    ProfileService
  ]
})

export class ProfileModule {}