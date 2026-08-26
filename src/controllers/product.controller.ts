import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct as updateProductModel,
} from "../models/product.model.js";

// GET /api/menu
export const getMenu = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Obtener todos los productos del menú' */
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET /api/menu/:id
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Obtener un producto por su ID' */
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

// POST /api/menu
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Crear un nuevo producto'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del nuevo producto',
        schema: {
          $nombre: 'Mofongo Especial',
          $descripcion: 'Plátano verde con chicharrón y salsa criolla',
          $precio: 550.00
        }
      } */
  try {
    const { nombre, descripcion, precio } = req.body;
    const newProduct = await insertProduct(nombre, descripcion, precio);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT /api/menu/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Products']
      #swagger.summary = 'Actualizar un producto existente'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados del producto',
        schema: {
          $nombre: 'Mofongo Especial Editado',
          $descripcion: 'Plátano verde con queso y chicharrón',
          $precio: 600.00
        }
      } */
  try {
    const id = parseInt(req.params.id as string, 10);
    const { nombre, descripcion, precio } = req.body;
    const updated = await updateProductModel(id, nombre, descripcion, precio);

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