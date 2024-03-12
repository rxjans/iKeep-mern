import express from 'express';
import test, {  deleteUser, deleteUserAdmin, getusers, signout, updateUser, validUser } from '../Controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getusers);
router.delete("/deleteuser/:userId/:userIdToDel", verifyToken, deleteUserAdmin);
router.get("/validuser", verifyToken, validUser);

export default router