import pool from "../config/db.js";

export interface Product {
  id_productos?: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

// Obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  const result = await pool.query("SELECT * FROM productos");
  return result.rows;
};

// Obtener un producto por ID
export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await pool.query("SELECT * FROM productos WHERE id_productos = $1", [id]);
  return result.rows[0] || null;
};

// Crear un nuevo producto
export const insertProduct = async (
  name: string,
  description: string,
  price: number
): Promise<Product> => {
  const result = await pool.query(
    "INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *",
    [name, description, price]
  );
  return result.rows[0];
};

// Actualizar un producto existente
export const updateProduct = async (
  id: number,
  name: string,
  description: string,
  price: number
): Promise<Product | null> => {
  const result = await pool.query(
    "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3 WHERE id_productos = $4 RETURNING *",
    [name, description, price, id]
  );
  return result.rows[0] || null;
};