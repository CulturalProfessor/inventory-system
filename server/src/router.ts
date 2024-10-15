import express from "express";
import {
  loginRoutes,
  registerRoutes,
  getUsers,
} from "./controllers/userController";
import {
  addBulkProductsWithCSV,
  addProduct,
  deleteProduct,
  getProducts,
  predictProduct,
  updateProduct,
  uploadCSV,
} from "./controllers/productController";
import { authenticateToken } from "./middleware";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports CSV file types."));
  },
});

router.get("/users", authenticateToken, getUsers);
router.post("/login", loginRoutes);
router.post("/register", registerRoutes);
router.post("/product/add", authenticateToken, addProduct);
router.post(
  "/product/addBulk",
  authenticateToken,
  upload.single("file"),
  addBulkProductsWithCSV
);
router.get("/product", authenticateToken, getProducts);
router.post("/product/update", authenticateToken, updateProduct);
router.delete("/product/delete", authenticateToken, deleteProduct);
router.post("/product/predict", authenticateToken, predictProduct);
router.post(
  "/product/uploadData",
  authenticateToken,
  upload.single("file"),
  uploadCSV
);

export default router;
