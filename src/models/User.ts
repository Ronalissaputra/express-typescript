import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/sequelizeConnection";

interface userAttributes {
  id?: number,
  username?: string,
  email?: string,
  password?: string,
  roleId?: number,
  rtoken?: string | null,

  createdAt?: Date,
  updatedAt?: Date
}

export interface Userinput extends Optional<userAttributes, 'id'>{}
export interface Useroutput extends Required<userAttributes>{}

class User extends Model<userAttributes, Userinput> implements userAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public rtoken!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any){
    User.belongsTo(models.Role, {foreignKey: "roleId"})
  }

}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
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
},{
    timestamps: true,
    tableName: "Users",
    modelName: "User",
    sequelize: sequelizeConnection,
    underscored: false
  })

export default User;

