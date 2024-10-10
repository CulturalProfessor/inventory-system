"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controllers/controller"); // Import the loginRoutes function
const router = express_1.default.Router();
router.get("/users", controller_1.getUsers);
router.post("/login", controller_1.loginRoutes);
router.post("/register", controller_1.registerRoutes);
exports.default = router;
