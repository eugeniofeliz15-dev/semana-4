import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const productRouter: Router = Router();

// GET /api/menu
productRouter.get("/menu", getMenu);

// GET /api/menu/:id
productRouter.get("/menu/:id", getProduct);

// POST /api/menu
productRouter.post("/menu", createProduct);

// PUT /api/menu/:id
productRouter.put("/menu/:id", updateProduct);

export default productRouter;