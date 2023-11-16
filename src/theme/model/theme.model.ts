import { DataType, Model, Table, Column, HasMany } from "sequelize-typescript";
import { Collection } from "src/collection/models/collection.model";

interface IThemeCreationModel {
    name: string;
}

@Table({tableName: 'themes', createdAt: false, updatedAt: false})
export class Theme extends Model<Theme, IThemeCreationModel> {
     
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @HasMany(() => Collection)
    collections: Collection[]
}