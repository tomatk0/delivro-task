import "dotenv/config";
import express from "express";
import cors from "cors";
import { createTables } from "./db/tables";
import router from "./routes/invoices.routes";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use("/invoice", router);

createTables()
  .then(() => console.log("Tables ensured"))
  .catch((err) => {
    console.error("Failed to create tables:", err);
    process.exit(1);
  });

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
