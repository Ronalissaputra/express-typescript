import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config()

const dbusername = process.env.DB_USERNAME as string;
const dbname = process.env.DB_NAME as string;
const dbpassword = process.env.DB_PASSWORD;
const dbhost = process.env.DB_HOST;
const dbdialect = "mysql";

export const sequelizeConnection = new Sequelize(dbname, dbusername, dbpassword, {
    host: dbhost,
    dialect: dbdialect,
})