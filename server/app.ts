import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.all("/api/posts", async (req, res) => {
  // API Route for getting and adding posts
  if (req.method === "GET") {
    const posts = await prisma.post.findMany();
    return res.status(200).json({ success: true, posts });
  } else if (req.method === "POST") {
    const postData: { title: string; content: string } = req.body;
    if (!postData.title || !postData.content)
      return res.status(400).json({
        success: false,
        error: "Request body cannot be empty or missing title and content",
      });
    try {
      const newPost = await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
        },
      });
      return res.status(200).json({ success: true, newPost });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
});

app.all("/api/posts/:postId", async (req, res) => {
  //  API Route for getting, updating, and deleting single post
  const postId: any = req.params.postId;

  if (req.method === "GET") {
    const post = await prisma.post.findFirst({
      where: { id: Number(postId) },
    });
    if (!post)
      return res.status(400).json({ success: false, error: "No post exists" });
    return res.status(200).json({ success: true, post });
  } else if (req.method === "PUT") {
    const postUpdateData: { title: string; content: string } = req.body;
    try {
      const updatedPost = await prisma.post.update({
        where: { id: Number(postId) },
        data: {
          title: postUpdateData.title,
          content: postUpdateData.content,
        },
      });
      return res.status(200).json({ success: true, updatedPost });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletePost = await prisma.post.delete({
        where: { id: Number(postId) },
      });
      return res.status(200).json({ success: true, deletePost });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
