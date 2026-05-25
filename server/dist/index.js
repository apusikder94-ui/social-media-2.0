"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = require("./routes/authRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const commentRoutes_1 = require("./routes/commentRoutes");
dotenv_1.default.config();
(0, db_1.DataBase)();
const PORT = 5000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/api/auth", authRoutes_1.authRoutes);
app.use("/api/post", postRoutes_1.postRoutes);
app.use("/api/comment", commentRoutes_1.commentRoutes);
app.listen(PORT, () => {
    console.log(`This server is running on port ${PORT}`);
});
