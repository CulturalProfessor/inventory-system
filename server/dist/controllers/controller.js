"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.registerRoutes = exports.loginRoutes = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema_1 = __importDefault(require("../schema/userSchema"));
const loginRoutes = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userSchema_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        res.json({ message: "Login successful" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginRoutes = loginRoutes;
const registerRoutes = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new userSchema_1.default({
            username,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.registerRoutes = registerRoutes;
const getUsers = async (req, res) => {
    try {
        const users = await userSchema_1.default.find();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUsers = getUsers;
