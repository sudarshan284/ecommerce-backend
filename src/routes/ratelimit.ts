import express from "express";
import RateLimit from "express-rate-limit";
import userRouter from "../routes/api/userRoutes";
import productRouter from "../routes/api/productRoutes";

const router = express.Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
});

router.use(limiter);
router.use("/user", userRouter);
router.use("/product", productRouter);
export default router;
