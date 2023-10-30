import { DataType, Model, Table, Column } from "sequelize-typescript";

interface IUserCreationModel {
    email: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, IUserCreationModel> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;
    
    @Column({type: DataType.STRING, allowNull: false})
    password: string;
    
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isBanned: boolean;
}