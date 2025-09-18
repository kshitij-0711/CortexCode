import { Router } from "express";
import { signup, logout, login } from '../controllers/authController';

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;