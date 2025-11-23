import { Request, Response } from "express";
import { pool } from "../db/index";
import {
  insertInvoice,
  fetchInvoices,
  fetchCorrections,
} from "../db/invoices.repository";
import { insertCorrection } from "../db/corrections.repository";
import { Correction, Invoice, InvoicesResponse } from "../../../src/util/types";

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { company, page = "1", limit = "40" } = req.query;

    const pageNum = Number(page);
    const pageSize = Number(limit);
    const offset = (pageNum - 1) * pageSize;

    const { rows, totalCount } = await fetchInvoices(pool, {
      company: company as string | undefined,
      pageNum,
      pageSize,
      offset,
    });

    const invoices: Invoice[] = rows.map((row) => ({
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

    const response: InvoicesResponse = {
      data: invoices,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

export const getInvoiceCorrections = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await fetchCorrections(pool, id);

    const corrections: Correction[] = result.rows.map((row) => ({
      id: row.id,
      invoicedWeight: Number(row.invoiced_weight),
      invoicedPrice: Number(row.invoiced_price),
      updatedAt: row.updated_at,
    }));

    res.json(corrections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch corrections" });
  }
};

export const postInvoices = async (req: Request, res: Response) => {
  const invoices = req.body as Invoice[];

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return res.status(400).json({
      error: "Request body must be a non-empty array of invoices",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const invoice of invoices) {
      const result = await insertInvoice(client, invoice);

      if (result.rowCount === 0) {
        await insertCorrection(client, invoice);
      }
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: `${invoices.length} invoices processed successfully`,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to insert invoices" });
  } finally {
    client.release();
  }
};
