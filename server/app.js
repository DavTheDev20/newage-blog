"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.all("/api/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // API Route for getting and adding posts
    if (req.method === "GET") {
        const posts = yield prisma.post.findMany();
        return res.status(200).json({ success: true, posts });
    }
    else if (req.method === "POST") {
        const postData = req.body;
        if (!postData.title || !postData.content)
            return res.status(400).json({
                success: false,
                error: "Request body cannot be empty or missing title and content",
            });
        try {
            const newPost = yield prisma.post.create({
                data: {
                    title: postData.title,
                    content: postData.content,
                },
            });
            return res.status(200).json({ success: true, newPost });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}));
app.all("/api/posts/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  API Route for getting, updating, and deleting single post
    const postId = req.params.postId;
    if (req.method === "GET") {
        const post = yield prisma.post.findFirst({
            where: { id: Number(postId) },
        });
        if (!post)
            return res.status(400).json({ success: false, error: "No post exists" });
        return res.status(200).json({ success: true, post });
    }
    else if (req.method === "PUT") {
        const postUpdateData = req.body;
        try {
            const updatedPost = yield prisma.post.update({
                where: { id: Number(postId) },
                data: {
                    title: postUpdateData.title,
                    content: postUpdateData.content,
                },
            });
            return res.status(200).json({ success: true, updatedPost });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    else if (req.method === "DELETE") {
        try {
            const deletePost = yield prisma.post.delete({
                where: { id: Number(postId) },
            });
            return res.status(200).json({ success: true, deletePost });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}));
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
