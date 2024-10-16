import express from "express";
import router from "./router";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const environment = process.env.NODE_ENV || "development";
let mongoConnectionString = "";

if (environment === "development") {
  mongoConnectionString = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DATABASE_NAME}`;
} else if (environment === "production") {
  mongoConnectionString = process.env.DB_URI || "";
}
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/", router);
 
const port = process.env.PORT || 3000;

mongoose
  .connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port} connected to ${mongoConnectionString}`
  );
});
