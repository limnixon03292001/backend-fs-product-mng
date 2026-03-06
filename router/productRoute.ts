import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsDetails,
  updateProduct,
} from "../controller/productController.js";
import authMiddleware from "../middleware/auth.js";
import { validateProductMiddleware } from "../middleware/validator.js";

const productRoute = express.Router();

productRoute.post(
  "/products",
  authMiddleware,
  validateProductMiddleware,
  createProduct,
);
productRoute.get("/products", authMiddleware, getProducts);
productRoute.put(
  "/products/:id",
  authMiddleware,
  validateProductMiddleware,
  updateProduct,
);

productRoute.get("/products/:id", authMiddleware, getProductsDetails);
productRoute.delete("/products/:id", authMiddleware, deleteProduct);

export default productRoute;
