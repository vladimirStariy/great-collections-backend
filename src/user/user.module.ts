import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from './models/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { Collection } from 'src/collection/models/collection.model';
import { Favorites } from 'src/collection/models/favorite.model';
import { Comment } from 'src/comment/model/comment.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Collection, Favorites, Comment]),
    forwardRef(() => AuthModule)
  ],
  exports: [
    UserService
  ]
})

export class UserModule {}
