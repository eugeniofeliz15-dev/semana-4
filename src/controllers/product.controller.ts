import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct as updateProductModel,
} from "../models/product.model.js";


export const getMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Crear un nuevo producto'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo producto',
        schema: {
          $name: 'Agua fresca',
          $description: 'De Jamaica',
          $price: 25
        }
      } */
  try {
    const name = req.body.name || req.body.nombre;
    const description = req.body.description || req.body.descripcion;
    const price = req.body.price ?? req.body.precio;

    const newProduct = await insertProduct(name, description, price);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Actualizar un producto existente'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados del producto',
        schema: {
          $name: 'Agua fresca editada',
          $description: 'De Tamarindo',
          $price: 30
        }
      } */
  try {
    const id = parseInt(req.params.id as string, 10);
    const name = req.body.name || req.body.nombre;
    const description = req.body.description || req.body.descripcion;
    const price = req.body.price ?? req.body.precio;

    const updated = await updateProductModel(id, name, description, price);

    if (!updated) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
