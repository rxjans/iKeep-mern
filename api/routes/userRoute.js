import express from 'express';
import test, {  deleteUser, updateUser } from '../Controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
            
export default router