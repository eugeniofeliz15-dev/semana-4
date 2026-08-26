import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "El nombre no puede estar vacío"),
  description: z.string().trim().min(1, "La descripción no puede estar vacía"),
  price: z.number().positive("El precio debe ser mayor a cero"),
  cost: z.number().nonnegative("El costo debe ser mayor o igual a cero").optional(),
  stock: z.number().int("El stock debe ser un entero").nonnegative("El stock debe ser mayor o igual a cero").optional(),
});

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Datos de producto inválidos",
      errors: result.error.format(),
    });
    return;
  }

  next();
};