import express, { urlencoded, json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import CartRouter from "./routes/cart.js";
import { getProducts } from "./controllers/productController.js";
import config from "./config/envConfig.js";
import bodyParser from 'body-parser';
import authMiddleware from "./middlewares/auth.middleware.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(json());

app.get("/", getProducts);
app.use(userRouter);
app.use("/admin", authMiddleware("admin"), productRouter);
app.use("/", CartRouter);

const dbURI = config.DB_URI;
console.log(dbURI);
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to mongoDB database");
    app.listen(5000, () => {
      console.log("server listening on port 5000");
    });
  })
  .catch((err) => {
    console.log("Error occurred", err);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});
