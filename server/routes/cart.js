import { Router } from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/userCartController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/carts/add", authMiddleware("user"), addToCart);

router.delete(
  "/cart/remove/:productId",
  authMiddleware("user"),
  removeFromCart
);

router.get("/cart", authMiddleware("user"), getCart);

export default router;
