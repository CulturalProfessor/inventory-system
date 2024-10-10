import express from "express";
import {
  loginRoutes,
  registerRoutes,
  getUsers,
} from "./controllers/userController";
import {
  addProduct,
  deleteProduct,
  getProducts,
  predictProduct,
  updateProduct,
} from "./controllers/productController";
import { authenticateToken } from "./middleware";

const router = express.Router();

router.get("/users", authenticateToken, getUsers);
router.post("/login", loginRoutes);
router.post("/register", registerRoutes);
router.post("/product/add", authenticateToken, addProduct);
router.get("/product", authenticateToken, getProducts); 
router.post("/product/update", authenticateToken, updateProduct);
router.delete("/product/delete", authenticateToken, deleteProduct);
router.post("/product/predict", authenticateToken, predictProduct);

export default router;
