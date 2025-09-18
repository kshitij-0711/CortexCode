import { Router } from "express";
import { getReviewCode, sendReviewCode } from "../controllers/reviewController";
import { userMiddleware } from "../middlewares/Middlewares";

const reviewRouter = Router();

reviewRouter.post("/",userMiddleware, sendReviewCode);
reviewRouter.get("/",userMiddleware, getReviewCode);

export default reviewRouter;