import type { Pool } from "pg";
import { Correction } from "../../../src/util/types";

export const fetchInvoiceCorrections = async (
  pool: Pool,
  invoiceId: string
): Promise<Correction[]> => {
  const query = `
    SELECT id, invoiced_weight, invoiced_price, updated_at
    FROM invoice_corrections
    WHERE invoice_id = $1
    ORDER BY updated_at DESC
  `;

  const result = await pool.query(query, [invoiceId]);

  const corrections: Correction[] = result.rows.map((row) => ({
    id: row.id,
    invoicedWeight: row.invoiced_weight,
    invoicedPrice: row.invoiced_price,
    updatedAt: row.updated_at,
  }));

  return corrections;
};
