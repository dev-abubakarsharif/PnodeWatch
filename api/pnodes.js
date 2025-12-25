import NodeCache from "node-cache";
import { fetchAllPnodes } from "../utils/fetchPnodes.js";

// Cache for serverless function
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export default async function handler(req, res) {
  try {
    const cachedPods = cache.get("pnodes");
    if (cachedPods) {
      return res.status(200).json({
        source: "cache",
        count: cachedPods.length,
        data: cachedPods,
      });
    }

    const pods = await fetchAllPnodes();
    cache.set("pnodes", pods);

    res.status(200).json({
      source: "rpc",
      count: pods.length,
      data: pods,
    });
  } catch (err) {
    console.error("pNode fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch pNodes", message: err.message });
  }
}
