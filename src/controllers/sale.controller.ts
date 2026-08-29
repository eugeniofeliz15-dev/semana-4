import type { Request, Response } from "express";
import { getAllSales, getSaleById, insertSaleWithItems } from "../models/sale.model.js";

// GET /api/sales
export const getSales = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Sales']
      #swagger.summary = 'Obtener todas las ventas con datos del cliente y total' */
  try {
    const sales = await getAllSales();
    res.json(sales);
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /api/sales/:id
export const getSale = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Sales']
      #swagger.summary = 'Obtener una venta con sus productos detallados' */
  try {
    const id = parseInt(req.params.id as string, 10);
    const sale = await getSaleById(id);

    if (!sale) {
      res.status(404).json({ message: "Venta no encontrada" });
      return;
    }

    res.json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST /api/sales
export const createSale = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Sales']
      #swagger.summary = 'Crear una venta con sus productos'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la venta y lista de productos',
        schema: {
          $id_cliente: 1,
          $fecha: '2026-08-29',
          $estado: 'completado',
          $items: [
            {
              $id_producto: 1,
              $cantidad: 2
            }
          ]
        }
      } */
  try {
    const id_cliente = req.body.id_cliente || req.body.customerId;
    const fecha = req.body.fecha || req.body.date || new Date().toISOString().split("T")[0];
    const estado = req.body.estado || req.body.status || "pendiente";
    const items = req.body.items || [];

    if (!id_cliente) {
      res.status(400).json({ message: "El id_cliente es obligatorio" });
      return;
    }

    const newSale = await insertSaleWithItems(id_cliente, fecha, estado, items);
    res.status(201).json(newSale);
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};