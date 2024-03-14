import express from "express";
import { createComment, getComments } from "../Controllers/commentController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get('/getcomments/:postId', getComments);

export default router;