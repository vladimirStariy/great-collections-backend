import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { CollectionModule } from "./collection/collection.module";
import { Collection } from "./collection/models/collection.model";
import { TagModule } from "./tag/tag.module";
import { Tag } from "./tag/model/tag.model";
import { CollectionItem } from "./collection/models/collection.item";
import { CollectionItemTag } from "./tag/model/collection.item.tag";
import { CollectionField } from "./collection/models/collection.field";
import { CollectionFieldValue } from "./collection/models/collection.field.value";
import { GoogleDriveModule } from "./google-drive/google.module";
import { ThemeModule } from "./theme/theme.module";
import { Theme } from "./theme/model/theme.model";
import { Favorites } from "./collection/models/favorite.model";
import { ProfileModule } from "./profile/profile.module";
import { Comment } from './comment/model/comment.model'
import { CommentModule } from "./comment/comment.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            models: [
                User, 
                Collection, 
                CollectionField, 
                CollectionItem,
                CollectionFieldValue,
                CollectionItemTag, 
                Tag,
                Theme,
                Comment,
                Favorites
            ],
            autoLoadModels: true
        }),
        GoogleDriveModule.register({
            clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
            redirectUrl: process.env.GOOGLE_DRIVE_REDIRECT_URL,
            refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
        }),
        UserModule,
        AuthModule,
        CollectionModule,
        TagModule,
        ThemeModule,
        ProfileModule,
        CommentModule
    ],
    controllers: [],
    providers: [CommentModule]
})

export class AppModule {}