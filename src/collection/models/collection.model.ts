import { DataType, Model, Table, Column, AllowNull, HasMany } from "sequelize-typescript";
import { CollectionField } from "./collection.field";
import { CollectionItem } from "./collection.item";

interface ICollectionCreationModel {
    name: string;
    description: string;
    theme: string;
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

    @HasMany(() => CollectionField)
    customFields: CollectionField[]

    @HasMany(() => CollectionItem)
    items: CollectionItem[]
}