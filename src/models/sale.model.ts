import pool from "../config/db.js";

export interface SaleItem {
  id_detalle_pedido?: number;
  id_producto: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Sale {
  id_pedido?: number;
  fecha: string | Date;
  id_cliente: number;
  cliente_nombre?: string;
  cliente_email?: string;
  estado: string;
  total?: number;
  items?: SaleItem[];
}

export interface CreateSaleItemDTO {
  id_producto: number;
  cantidad: number;
  precio_unitario?: number;
}

// 1. Obtener todas las ventas con datos del cliente y monto total calculado
export const getAllSales = async (): Promise<Sale[]> => {
  const query = `
    SELECT 
      p.id_pedido,
      p.fecha,
      p.id_cliente,
      c.nombre AS cliente_nombre,
      c.email AS cliente_email,
      p.estado,
      COALESCE(SUM(dp.cantidad * dp.precio_unitario), 0) AS total
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    GROUP BY p.id_pedido, p.fecha, p.id_cliente, c.nombre, c.email, p.estado
    ORDER BY p.id_pedido ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// 2. Obtener una venta por ID con la lista detallada de productos comprados
export const getSaleById = async (id: number): Promise<Sale | null> => {
  // Consultar datos generales del pedido y cliente
  const saleQuery = `
    SELECT 
      p.id_pedido,
      p.fecha,
      p.id_cliente,
      c.nombre AS cliente_nombre,
      c.email AS cliente_email,
      p.estado
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    WHERE p.id_pedido = $1
  `;
  const saleResult = await pool.query(saleQuery, [id]);

  if (saleResult.rows.length === 0) {
    return null;
  }

  const sale = saleResult.rows[0];

  // Consultar los productos dentro del pedido con INNER JOIN a productos
  const itemsQuery = `
    SELECT 
      dp.id_detalle_pedido,
      dp.id_producto,
      pr.nombre AS producto_nombre,
      dp.cantidad,
      dp.precio_unitario,
      (dp.cantidad * dp.precio_unitario) AS subtotal
    FROM detalle_pedido dp
    INNER JOIN productos pr ON dp.id_producto = pr.id_productos
    WHERE dp.id_pedido = $1
  `;
  const itemsResult = await pool.query(itemsQuery, [id]);
  sale.items = itemsResult.rows;

  // Calcular total acumulado de la venta
  sale.total = sale.items.reduce(
    (acc: number, item: { subtotal: string | number }) => acc + Number(item.subtotal),
    0
  );

  return sale;
};

// 3. Crear una venta con sus productos usando una transacción
export const insertSaleWithItems = async (
  id_cliente: number,
  fecha: string | Date,
  estado: string,
  items: CreateSaleItemDTO[]
): Promise<Sale | null> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // A. Insertar cabecera en 'pedido'
    const insertPedidoQuery = `
      INSERT INTO pedido (id_cliente, fecha, estado)
      VALUES ($1, $2, $3)
      RETURNING id_pedido, fecha, id_cliente, estado
    `;
    const pedidoRes = await client.query(insertPedidoQuery, [id_cliente, fecha, estado]);
    const nuevoPedido = pedidoRes.rows[0];

    // B. Insertar cada producto en 'detalle_pedido'
    for (const item of items) {
      let precioUnitario = item.precio_unitario;

      // Si no se envía precio unitario, se consulta directo de la tabla 'productos'
      if (precioUnitario === undefined) {
        const prodRes = await client.query(
          "SELECT precio FROM productos WHERE id_productos = $1",
          [item.id_producto]
        );
        if (prodRes.rows.length > 0) {
          precioUnitario = prodRes.rows[0].precio;
        } else {
          precioUnitario = 0;
        }
      }

      await client.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [nuevoPedido.id_pedido, item.id_producto, item.cantidad, precioUnitario]
      );
    }

    await client.query("COMMIT");
    return nuevoPedido;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};