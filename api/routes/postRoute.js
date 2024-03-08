import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts } from '../Controllers/postController.js';
const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:userId/:postId", verifyToken, deletepost);

export default router;