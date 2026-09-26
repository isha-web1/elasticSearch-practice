import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import type { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";

import { esClient, ensureIndex, INDEX_NAME } from "./es-client";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4100;

// ============================================
// GET /api/search
// ============================================

app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const category = req.query.category as string | undefined;

    const trimmedQuery = q.trim();

    let query: QueryDslQueryContainer;

    // --------------------------------------------
    // Search + category
    // --------------------------------------------

    if (trimmedQuery && category) {
      query = {
        bool: {
          must: [
            {
              multi_match: {
                query: trimmedQuery,
                type: "bool_prefix",
                fields: [
                  "name",
                  "name._2gram",
                  "name._3gram",
                  "description",
                  "description._2gram",
                  "description._3gram",
                ],
              },
            },
          ],
          filter: [
            {
              term: {
                category: category,
              },
            },
          ],
        },
      };
    }

    // --------------------------------------------
    // Search only
    // --------------------------------------------

    else if (trimmedQuery) {
      query = {
        multi_match: {
          query: trimmedQuery,
          type: "bool_prefix",
          fields: [
            "name",
            "name._2gram",
            "name._3gram",
            "description",
            "description._2gram",
            "description._3gram",
          ],
        },
      };
    }

    // --------------------------------------------
    // Category only
    // --------------------------------------------

    else if (category) {
      query = {
        bool: {
          filter: [
            {
              term: {
                category: category,
              },
            },
          ],
        },
      };
    }

    // --------------------------------------------
    // No search / no category
    // --------------------------------------------

    else {
      query = {
        match_all: {},
      };
    }

    // --------------------------------------------
    // Elasticsearch search
    // --------------------------------------------

    const result = await esClient.search({
      index: INDEX_NAME,
      query,
      size: 20,
    });

    // --------------------------------------------
    // Format results
    // --------------------------------------------

    const hits = result.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...(hit._source as object),
    }));

    res.json({
      total: result.hits.total,
      results: hits,
    });
  } catch (err) {
    console.error("Search error:", err);

    res.status(500).json({
      error: "Search failed",
    });
  }
});

// ============================================
// POST /api/products
// ============================================

app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const { name, description, category, price } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        error: "name, category and price are required",
      });
    }

    const response = await esClient.index({
      index: INDEX_NAME,
      document: {
        name,
        description,
        category,
        price,
        createdAt: new Date().toISOString(),
      },
      refresh: true,
    });

    res.status(201).json({
      id: response._id,
    });
  } catch (err) {
    console.error("Product indexing error:", err);

    res.status(500).json({
      error: "Failed to index product",
    });
  }
});

// ============================================
// GET /api/health
// ============================================

app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    const health = await esClient.cluster.health();

    res.json(health);
  } catch (err) {
    console.error("Health check error:", err);

    res.status(500).json({
      error: "Elasticsearch health check failed",
    });
  }
});

// ============================================
// START SERVER
// ============================================

async function start() {
  try {
    await ensureIndex();

    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();