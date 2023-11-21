import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { CollectionItem } from 'src/collection/models/collection.item';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Favorites } from 'src/collection/models/favorite.model';
import { Collection } from 'src/collection/models/collection.model';
import { CollectionModule } from 'src/collection/collection.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    forwardRef(() => CollectionModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    SequelizeModule.forFeature([Favorites, CollectionItem, Collection]),
  ],
  exports: [
    ProfileService
  ]
})

export class ProfileModule {}