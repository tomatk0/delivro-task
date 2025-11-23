import { PoolClient } from "pg";
import { randomUUID } from "crypto";
import { Invoice } from "../../../src/util/types";

export const insertCorrection = async (
  client: PoolClient,
  invoice: Invoice
) => {
  const query = `
    INSERT INTO invoice_corrections (
      id, invoice_id, invoiced_weight, invoiced_price, updated_at
    )
    VALUES ($1,$2,$3,$4,NOW());
  `;

  const values = [
    randomUUID(),
    invoice.id,
    invoice.invoicedWeight,
    invoice.invoicedPrice,
  ];

  return client.query(query, values);
};
