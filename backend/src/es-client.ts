import { Client } from "@elastic/elasticsearch";
import * as dotenv from "dotenv";

dotenv.config();

export const INDEX_NAME = process.env.INDEX_NAME || "products";

export const esClient = new Client({
  node: process.env.ELASTIC_NODE || "http://localhost:9200",
});

// Creates the index with an explicit mapping if it doesn't already exist.
export async function ensureIndex(): Promise<void> {
  const exists = await esClient.indices.exists({
    index: INDEX_NAME,
  });

  if (!exists) {
    await esClient.indices.create({
      index: INDEX_NAME,
      mappings: {
        properties: {
          name: {
            type: "search_as_you_type",
          },

          description: {
            type: "search_as_you_type",
          },

          category: {
            type: "keyword",
          },

          price: {
            type: "float",
          },

          createdAt: {
            type: "date",
          },
        },
      },
    });

    console.log(`Created index "${INDEX_NAME}"`);
  }
}