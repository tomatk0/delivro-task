import type { Request, Response } from "express";
import { pool } from "../db";
import { fetchInvoices, insertInvoices } from "../db/invoicesRepository";
import { Invoice } from "../../../src/util/types";
import { fetchInvoiceCorrections } from "../db/correctionsRepository";

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { company, page = "1", limit = "40" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    const result = await fetchInvoices(pool, {
      company: company ? String(company) : undefined,
      page: Number.isFinite(pageNum) ? pageNum : 1,
      limit: Number.isFinite(pageSize) ? pageSize : 40,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

export const postInvoices = async (req: Request, res: Response) => {
  const invoices = req.body as Invoice[];

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body must be a non-empty array of invoices" });
  }

  try {
    const processed = await insertInvoices(pool, invoices);
    return res
      .status(201)
      .json({ message: `${processed} invoices processed successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to insert invoices" });
  }
};

export const getInvoiceCorrections = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Invoice id is required" });
    }

    const corrections = await fetchInvoiceCorrections(pool, id);
    return res.json(corrections);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch corrections" });
  }
};
