import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4100;








// ============================================
// START SERVER
// ============================================

async function start() {
  try {

   await app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();