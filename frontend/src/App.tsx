import { useEffect, useState } from "react";

const API_URL = "http://localhost:4100";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  score: number;
}

const CATEGORIES = ["All", "Electronics", "Furniture", "Home", "Apparel", "Outdoors", "Fitness"];

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category !== "All") params.set("category", category);

        const res = await fetch(`${API_URL}/api/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Could not reach the search API. Is the backend running on port 4000?");
        }
      } finally {
        setLoading(false);
      }
    }, 250); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, category]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Product search</h1>
        <p className="mt-1 text-sm text-slate-500">Backed by Elasticsearch, queried in real time.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-slate-400">Searching…</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-sm text-slate-400">No products found.</p>
          )}

          <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {results.map((product) => (
              <li key={product.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.description}</p>
                  <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {product.category}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-slate-700">
                  ${product.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
