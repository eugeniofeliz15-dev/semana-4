import type { Request, Response } from "express";
import {
  getAllCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer as updateCustomerModel,
} from "../models/customer.model.js";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getCustomer = async (req: Request, res: Response): Promise<void> => {

  try {
    const id = parseInt(req.params.id as string, 10);
    const customer = await getCustomerById(id);

    if (!customer) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Customers']
      #swagger.summary = 'Crear un nuevo cliente'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del cliente',
        schema: {
          $name: 'Juan Pérez',
          $email: 'juan@example.com',
          phone: '5551234567'
        }
      } */
  try {
    const nombre = req.body.name || req.body.nombre;
    const email = req.body.email;
    const telefono = req.body.phone || req.body.telefono;

    const newCustomer = await insertCustomer(nombre, email, telefono);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  /*  #swagger.tags = ['Customers']
      #swagger.summary = 'Actualizar un cliente existente'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos actualizados del cliente',
        schema: {
          $name: 'Juan Pérez Actualizado',
          $email: 'juan_nuevo@example.com',
          phone: '5559876543'
        }
      } */
  try {
    const id = parseInt(req.params.id as string, 10);
    const nombre = req.body.name || req.body.nombre;
    const email = req.body.email;
    const telefono = req.body.phone || req.body.telefono;

    const updated = await updateCustomerModel(id, nombre, email, telefono);

    if (!updated) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
