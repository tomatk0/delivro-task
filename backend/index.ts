import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { Correction, Invoice } from "../src/util/types";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createTables = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    shipment_id TEXT NOT NULL,
    shipment_created_at TIMESTAMP NOT NULL,
    tracking_number TEXT NOT NULL,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    provider TEXT CHECK (provider IN ('GLS','DPD','UPS','PPL','FedEx')),
    mode TEXT CHECK (mode IN ('EXPORT','IMPORT')),
    origin_country TEXT NOT NULL,
    destination_country TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS invoice_corrections (
    id UUID PRIMARY KEY,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
    invoiced_weight NUMERIC NOT NULL,
    invoiced_price NUMERIC NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
  );
  `;
  await pool.query(query);
  console.log("Tables created");
};

createTables();

app.get("/invoices", async (req, res) => {
  try {
    const { company, page = "1", limit = "40" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * pageSize;

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

    const countResult = await pool.query(
      `SELECT COUNT(*) ${baseQuery}`,
      params
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT i.id, i.shipment_id, i.shipment_created_at, i.tracking_number,
             i.company_id, i.company_name, i.provider, i.mode,
             i.origin_country, i.destination_country,
             ic.invoiced_weight, ic.invoiced_price, ic.updated_at
      ${baseQuery}
      ORDER BY i.shipment_created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(pageSize, offset);

    const result = await pool.query(query, params);

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

    res.json({
      data: invoices,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

app.get("/invoices/:id/corrections", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, invoiced_weight, invoiced_price, updated_at
      FROM invoice_corrections
      WHERE invoice_id = $1
      ORDER BY updated_at DESC
    `;

    const result = await pool.query(query, [id]);

    const corrections: Correction[] = result.rows.map((row) => ({
      id: row.id,
      invoicedWeight: row.invoiced_weight,
      invoicedPrice: row.invoiced_price,
      updatedAt: row.updated_at,
    }));

    res.json(corrections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch corrections" });
  }
});

app.post("/invoices", async (req, res) => {
  const invoices: Invoice[] = req.body;

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body must be a non-empty array of invoices" });
  }

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
    res
      .status(201)
      .json({ message: `${invoices.length} invoices processed successfully` });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to insert invoices" });
  } finally {
    client.release();
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
