import { DataTypes, Model, Optional } from "sequelize"
import { sequelizeConnection } from "../config/sequelizeConnection"

interface adminAttributes {
    id?: number,
    username?: string,
    email?: string,
    password?: string,
    roleId?: number,
    rtoken?: string | null,

    createdAt?: Date,
    updatedAt?: Date,
}

export interface Admininput extends Optional <adminAttributes, 'id'> {}
export interface Adminoutput extends Required<adminAttributes>{}

class Admin extends Model<adminAttributes, Admininput> implements adminAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public roleId!: number;
    public rtoken!: string

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        Admin.belongsTo(models.Role, {foreignKey: "roleId"})
    }
}

Admin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    },
    roleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    rtoken: {
        allowNull: true,
        type: DataTypes.STRING,
    }
}, {
    tableName: "Admins",
    modelName: "Admin",
    timestamps: true,
    sequelize: sequelizeConnection,
})

export default Admin;