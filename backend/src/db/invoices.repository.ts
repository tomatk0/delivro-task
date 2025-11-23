import { Pool, PoolClient } from "pg";
import { Invoice } from "../../../src/util/types";

export const insertInvoice = async (client: PoolClient, invoice: Invoice) => {
  const query = `
    INSERT INTO invoices (
      id, shipment_id, shipment_created_at, tracking_number,
      company_id, company_name, provider, mode,
      origin_country, destination_country
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    ON CONFLICT (id) DO NOTHING;
  `;

  const values = [
    invoice.id,
    invoice.shipment.id,
    invoice.shipment.createdAt,
    invoice.shipment.trackingNumber,
    invoice.shipment.company.id,
    invoice.shipment.company.name,
    invoice.shipment.provider,
    invoice.shipment.mode,
    invoice.shipment.originCountry,
    invoice.shipment.destinationCountry,
  ];

  return client.query(query, values);
};

export const fetchInvoices = async (
  pool: Pool,
  filters: {
    company?: string;
    pageNum: number;
    pageSize: number;
    offset: number;
  }
) => {
  const { company, pageSize, offset } = filters;

  let baseQuery = `
    FROM invoices i
    JOIN LATERAL (
      SELECT invoiced_weight, invoiced_price, updated_at
      FROM invoice_corrections
      WHERE invoice_id = i.id
      ORDER BY updated_at DESC
      LIMIT 1
    ) ic ON true
  `;

  const params = [];

  if (company) {
    baseQuery += ` WHERE i.company_name ILIKE $1`;
    params.push(`%${company}%`);
  }

  const countResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`, params);

  const totalCount = Number(countResult.rows[0].count);

  const query = `
    SELECT i.*, ic.invoiced_weight, ic.invoiced_price, ic.updated_at
    ${baseQuery}
    ORDER BY i.shipment_created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  params.push(pageSize, offset);

  const result = await pool.query(query, params);

  return {
    rows: result.rows,
    totalCount,
  };
};

export const fetchCorrections = async (pool: Pool, invoiceId: string) => {
  const query = `
    SELECT id, invoiced_weight, invoiced_price, updated_at
    FROM invoice_corrections
    WHERE invoice_id = $1
    ORDER BY updated_at DESC
  `;
  return pool.query(query, [invoiceId]);
};
