import { DataType, Model, Table, Column, AllowNull, HasMany, ForeignKey } from "sequelize-typescript";
import { CollectionField } from "./collection.field";
import { CollectionItem } from "./collection.item";
import { User } from "src/user/models/user.model";

interface ICollectionCreationModel {
    name: string;
    description: string;
    theme: string;
    imagePath?: string;
}

@Table({tableName: 'collections'})
export class Collection extends Model<Collection, ICollectionCreationModel> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @Column({type: DataType.STRING, allowNull: false})
    theme: string;

    @Column({type: DataType.STRING, allowNull: true})
    imagePath: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @HasMany(() => CollectionField)
    customFields: CollectionField[]

    @HasMany(() => CollectionItem)
    items: CollectionItem[]
}