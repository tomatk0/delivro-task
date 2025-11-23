import { pool } from "./index";

export const createTables = async () => {
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
};
