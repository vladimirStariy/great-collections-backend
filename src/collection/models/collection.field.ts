import { DataType, Model, Table, Column, AllowNull, BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import { Collection } from "./collection.model";
import { CollectionFieldValue } from "./collection.field.value";

interface ICollectionFieldsCreationData {
    name: string;
    data_type: string;
    collectionId: number;
}

@Table({tableName: 'collection-fields'})
export class CollectionField extends Model<CollectionField, ICollectionFieldsCreationData> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: false})
    data_type: string;

    @ForeignKey(() => Collection)
    @Column({type: DataType.INTEGER})
    collectionId: number;

    @HasMany(() => CollectionFieldValue)
    values: CollectionFieldValue[]
}