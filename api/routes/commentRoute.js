import express from "express";
import { createComment, editComment, getComments, likeComment } from "../Controllers/commentController.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get('/getcomments/:postId', getComments);
router.put('/likecomment/:commentId', verifyToken, likeComment);
router.put('/editcomment/:commentId', verifyToken, editComment);


export default router;