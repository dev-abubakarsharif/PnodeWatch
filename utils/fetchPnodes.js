import axios from "axios";

const RPC_NODES = [
  "173.212.203.145:6000",
  "173.212.220.65:6000",
  "161.97.97.41:6000",
  "192.190.136.36:6000",
  "192.190.136.37:6000",
  "192.190.136.38:6000",
  "192.190.136.28:6000",
  "192.190.136.29:6000",
  "207.244.255.1:6000"
];

const ACTIVE_THRESHOLD = 600; // 10 minutes

export async function fetchAllPnodes() {
  const podMap = new Map();
  const now = Math.floor(Date.now() / 1000);

  await Promise.all(
    RPC_NODES.map(async (node) => {
      try {
        const res = await axios.post(
          `http://${node}/rpc`,
          { jsonrpc: "2.0", id: 1, method: "get-pods-with-stats", params: [] },
          { timeout: 5000 } // serverless-friendly timeout
        );

        const pods = res.data?.result?.pods || [];
        if (!pods.length) return;

        pods.forEach((pod) => {
          if (!pod.pubkey) return;

          const lastSeenSec = pod.last_seen_timestamp > 1e12
            ? pod.last_seen_timestamp / 1000
            : pod.last_seen_timestamp;

          const isActive = now - lastSeenSec < ACTIVE_THRESHOLD;

          if (!podMap.has(pod.pubkey)) {
            podMap.set(pod.pubkey, { ...pod, isActive });
          } else {
            const existing = podMap.get(pod.pubkey);
            podMap.set(pod.pubkey, { ...existing, isActive: existing.isActive || isActive });
          }
        });

      } catch (err) {
        console.warn(`Failed RPC: ${node} - ${err.message}`);
      }
    })
  );

  return Array.from(podMap.values());
}
