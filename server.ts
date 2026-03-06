import express from "express";
import productRoute from "./router/productRoute.js";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./router/authRoute.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());

//localhost:5000/api/
app.use("/api", productRoute);
app.use("/auth", authRoute);

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server at port 5000");
});
