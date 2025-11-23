import type { Pool } from "pg";
import { Invoice, InvoicesResponse } from "../../../src/util/types";
import { randomUUID } from "crypto";

type FetchInvoicesProps = {
  company?: string;
  page: number;
  limit: number;
};

export const fetchInvoices = async (
  pool: Pool,
  { company, page, limit }: FetchInvoicesProps
): Promise<InvoicesResponse> => {
  const pageNum = Number.isFinite(page) && page > 0 ? page : 1;
  const pageSize = Number.isFinite(limit) && limit > 0 ? limit : 40;
  const offset = (pageNum - 1) * pageSize;

  let baseFrom = `
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
    baseFrom += ` WHERE i.company_name ILIKE $1`;
    params.push(`%${company}%`);
  }

  const countSql = `SELECT COUNT(*) ${baseFrom}`;
  const countResult = await pool.query(countSql, params);
  const totalCount = parseInt(countResult.rows[0].count, 10);

  const selectSql = `
    SELECT
      i.id,
      i.shipment_id,
      i.shipment_created_at,
      i.tracking_number,
      i.company_id,
      i.company_name,
      i.provider,
      i.mode,
      i.origin_country,
      i.destination_country,
      ic.invoiced_weight,
      ic.invoiced_price,
      ic.updated_at
    ${baseFrom}
    ORDER BY i.shipment_created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  params.push(pageSize, offset);

  const result = await pool.query(selectSql, params);

  const invoices: Invoice[] = result.rows.map((row) => ({
    id: row.id,
    shipment: {
      id: row.shipment_id,
      createdAt: row.shipment_created_at,
      trackingNumber: row.tracking_number,
      company: {
        id: row.company_id,
        name: row.company_name,
      },
      provider: row.provider,
      mode: row.mode,
      originCountry: row.origin_country,
      destinationCountry: row.destination_country,
    },
    invoicedWeight: Number(row.invoiced_weight),
    invoicedPrice: Number(row.invoiced_price),
    updatedAt: row.updated_at,
  }));

  return {
    data: invoices,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
};

export const insertInvoices = async (
  pool: Pool,
  invoices: Invoice[]
): Promise<number> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const invoice of invoices) {
      const insertInvoiceQuery = `
        INSERT INTO invoices (
          id, shipment_id, shipment_created_at, tracking_number,
          company_id, company_name, provider, mode,
          origin_country, destination_country
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (id) DO NOTHING;
      `;

      const invoiceValues = [
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

      await client.query(insertInvoiceQuery, invoiceValues);

      const insertCorrectionQuery = `
        INSERT INTO invoice_corrections (
          id, invoice_id, invoiced_weight, invoiced_price, updated_at
        )
        VALUES ($1,$2,$3,$4,NOW());
      `;

      const correctionValues = [
        randomUUID(),
        invoice.id,
        invoice.invoicedWeight,
        invoice.invoicedPrice,
      ];

      await client.query(insertCorrectionQuery, correctionValues);
    }

    await client.query("COMMIT");
    return invoices.length;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
