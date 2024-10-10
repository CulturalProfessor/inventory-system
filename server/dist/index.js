"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
require("dotenv").config();
app.use(express_1.default.json());
app.use("/", router_1.default);
const port = process.env.PORT || 3000;
const db_uri = process.env.DB_URI;
if (!db_uri) {
    console.error("DB_URI not set in environment variables.");
    process.exit(1);
}
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
mongoose_1.default
    .connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error(err);
});
