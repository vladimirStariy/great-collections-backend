import { DataType, Model, Table, Column, AllowNull, BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import { CollectionItem } from "./collection.item";
import { CollectionField } from "./collection.field";

export interface CollectionFieldValueCreationAttributes {
    collectionFieldId: number;
    collectionItemId: number;
    value: any;
}

@Table({tableName: 'collection-field-values'})
export class CollectionFieldValue extends Model<CollectionFieldValue, CollectionFieldValueCreationAttributes> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => CollectionField)
    @Column({type: DataType.INTEGER})
    collectionFieldId: number;

    @ForeignKey(() => CollectionItem)
    @Column({type: DataType.INTEGER})
    collectionItemId: number;

    @Column({type: DataType.JSON})
    value: any;
}