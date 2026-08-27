import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z.string().trim().email("Debe proporcionar un email válido"),
  phone: z.string().trim().optional(),
});

export const validateCustomer = (req: Request, res: Response, next: NextFunction): void => {
  const result = customerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Datos de cliente inválidos",
      errors: result.error.format(),
    });
    return;
  }

  next();
};