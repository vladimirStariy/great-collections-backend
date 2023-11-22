import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Comment } from './model/comment.model';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';
import { CollectionItem } from 'src/collection/models/collection.item';
import { CollectionModule } from 'src/collection/collection.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Collection } from 'src/collection/models/collection.model';

@Module({
    imports: [
      forwardRef(() => CollectionModule),
      forwardRef(() => UserModule),
      forwardRef(() => AuthModule),
      SequelizeModule.forFeature([Comment, Collection, CollectionItem]),
    ],
    controllers: [CommentController],
    providers: [CommentGateway, CommentService],
    
})

export class CommentModule {}