import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/sequelizeConnection";

interface userAttributes {
  id?: number,
  username?: string,
  email?: string,
  password?: string,
  role?: number,
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
  public role!: number;
  public rtoken!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
  role: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  rtoken: {
    allowNull: true,
    type: DataTypes.STRING,
  }
},{
    timestamps: true,
    tableName: "Users",
    sequelize: sequelizeConnection,
    underscored: false
  })

export default User;

