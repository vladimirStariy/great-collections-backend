import { DataType, Model, Table, Column, AllowNull, HasMany, ForeignKey } from "sequelize-typescript";
import { CollectionField } from "./collection.field";
import { CollectionItem } from "./collection.item";
import { User } from "src/user/models/user.model";
import { Theme } from "src/theme/model/theme.model";

interface ICollectionCreationModel {
    name: string;
    description: string;
    themeId: number;
    imagePath?: string;
    userId: number;
}

@Table({tableName: 'collections'})
export class Collection extends Model<Collection, ICollectionCreationModel> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.STRING, allowNull: true})
    imagePath: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ForeignKey(() => Theme)
    @Column({type: DataType.INTEGER})
    themeId: number;

    @HasMany(() => CollectionField)
    customFields: CollectionField[]

    @HasMany(() => CollectionItem)
    items: CollectionItem[]
}