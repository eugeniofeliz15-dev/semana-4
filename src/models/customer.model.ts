import pool from "../config/db.js";

export interface Customer {
  id_cliente?: number;
  nombre: string;
  email: string;
  telefono?: string | null;
}

// 1. Obtener todos los clientes
export const getAllCustomers = async (): Promise<Customer[]> => {
  const result = await pool.query(
    "SELECT id_cliente, nombre, email, telefono FROM cliente ORDER BY id_cliente ASC"
  );
  return result.rows;
};

// 2. Obtener un cliente por ID (Parametrizado con $1)
export const getCustomerById = async (id: number): Promise<Customer | null> => {
  const result = await pool.query(
    "SELECT id_cliente, nombre, email, telefono FROM cliente WHERE id_cliente = $1",
    [id]
  );
  return result.rows[0] || null;
};

// 3. Insertar un cliente (Parametrizado con $1, $2, $3)
export const insertCustomer = async (
  nombre: string,
  email: string,
  telefono?: string
): Promise<Customer> => {
  const result = await pool.query(
    "INSERT INTO cliente (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *",
    [nombre, email, telefono || null]
  );
  return result.rows[0];
};

// 4. Actualizar un cliente existente (Parametrizado con $1, $2, $3, $4)
export const updateCustomer = async (
  id: number,
  nombre: string,
  email: string,
  telefono?: string
): Promise<Customer | null> => {
  const result = await pool.query(
    "UPDATE cliente SET nombre = $1, email = $2, telefono = $3 WHERE id_cliente = $4 RETURNING *",
    [nombre, email, telefono || null, id]
  );
  return result.rows[0] || null;
};