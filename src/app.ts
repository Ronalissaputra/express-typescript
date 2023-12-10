import express from "express";
import { sequelizeConnection } from "./config/sequelizeConnection";
import dotenv from "dotenv";
import router from "./router/Router";

dotenv.config();
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(router)

app.listen({ port: 8000 }, async () => {
  console.log("Running port http://localhost:8000");
  await sequelizeConnection.authenticate();
  console.log("Database Connected");
});

