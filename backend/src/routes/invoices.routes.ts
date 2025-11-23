import { Router } from "express";
import {
  getInvoiceCorrections,
  getInvoices,
  postInvoices,
} from "../controllers/invoices.controller";

const router = Router();

router.get("/", getInvoices);
router.get("/:id/corrections", getInvoiceCorrections);
router.post("/", postInvoices);

export default router;
