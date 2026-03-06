import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controller/authController.js";
import authMiddleware from "../middleware/auth.js";

const authRoute = express.Router();

authRoute.post("/login", loginUser);
authRoute.post("/register", registerUser);

authRoute.post("/refresh-token", refreshToken);

authRoute.post("/logout", authMiddleware, logoutUser);

export default authRoute;
