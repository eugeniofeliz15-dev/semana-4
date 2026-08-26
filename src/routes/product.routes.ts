import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { validateProduct } from "../middlewares/validate-product.js";

const productRouter: Router = Router();

// GET /api/menu
productRouter.get("/menu", getMenu);

// GET /api/menu/:id
productRouter.get("/menu/:id", getProduct);

// POST /api/menu (middleware de validación inyectado)
productRouter.post("/menu", validateProduct, createProduct);

// PUT /api/menu/:id (también puedes mantenerlo aquí para validar actualizaciones)
productRouter.put("/menu/:id", validateProduct, updateProduct);

export default productRouter;