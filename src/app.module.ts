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
                Tag
            ],
            autoLoadModels: true
        }),
        GoogleDriveModule.register({
            clientId: '593131673474-b5lnt6kfvhvb3758n88ncfkm1pb79gv7.apps.googleusercontent.com',
            clientSecret: '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',
            redirectUrl: 'https://developers.google.com/oauthplayground',
            refreshToken: '1//04QnCTOKHCffcCgYIARAAGAQSNwF-L9IrbYjYKPTnWho11nx85TJKNi1L2CeGmCmMJIc2Xgkw-xce424Do8OYWWeockC7apCBzwE',
        }),
        UserModule,
        AuthModule,
        CollectionModule,
        TagModule
    ],
    controllers: [],
    providers: []
})

export class AppModule {}