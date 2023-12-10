import {DataTypes, Model, Optional} from "sequelize";
import { sequelizeConnection } from "../config/sequelizeConnection";

interface roleAttributes {
    id?: string,
    code?: number,

    createdAt?: Date,
    updatedAt?: Date
}

export interface Roleinput extends Optional<roleAttributes, 'id'>{}
export interface Roleoutput extends Required<roleAttributes>{}

class Role extends Model<roleAttributes, Roleinput> implements roleAttributes {
    public id!: string;
    public code!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any){
        Role.hasMany(models.Admin, {foreignKey: "roleId"})
        Role.hasMany(models.User, {foreignKey: "roleId"})
  }
}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    tableName: "Roles",
    modelName: "Role",
    timestamps: true,
    sequelize: sequelizeConnection,
})

export default Role;