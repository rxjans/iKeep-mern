import express from "express";
import { createComment } from "../Controllers/commentController";
const router = express.Router();

router.post("/create", verifyToken, createComment);

export default router;