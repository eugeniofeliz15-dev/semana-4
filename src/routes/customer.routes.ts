import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
} from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validate-customer.js";

const customerRouter: Router = Router();

// GET /api/customers
customerRouter.get("/customers", getCustomers);

// GET /api/customers/:id
customerRouter.get("/customers/:id", getCustomer);

// POST /api/customers
customerRouter.post("/customers", validateCustomer, createCustomer);

// PUT /api/customers/:id
customerRouter.put("/customers/:id", validateCustomer, updateCustomer);

export default customerRouter;