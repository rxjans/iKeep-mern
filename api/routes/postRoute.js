import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, update } from '../Controllers/postController.js';
const router = express.Router();

router.post("/create", verifyToken, create);
router.post("/update/:userId/:postId", verifyToken, update);
router.get("/getposts", getposts);
router.delete("/deletepost/:userId/:postId", verifyToken, deletepost);

export default router;