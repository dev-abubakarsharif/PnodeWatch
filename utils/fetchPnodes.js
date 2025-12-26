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

// Mark active only if seen within last 30 minutes
const ACTIVE_THRESHOLD = 1800;

export async function fetchAllPnodes() {
  const podMap = new Map();
  const now = Math.floor(Date.now() / 1000);

  await Promise.allSettled(
    RPC_NODES.map(async (node) => {
      try {
        const res = await axios.post(
          `http://${node}/rpc`,
          {
            jsonrpc: "2.0",
            id: 1,
            method: "get-pods-with-stats",
            params: []
          },
          { timeout: 5000 }
        );

        const pods = res.data?.result?.pods;
        if (!Array.isArray(pods)) return;

        pods.forEach((pod) => {
          if (!pod?.pubkey) return;

          const lastSeen =
            pod.last_seen_timestamp > 1e12
              ? Math.floor(pod.last_seen_timestamp / 1000)
              : pod.last_seen_timestamp;

          const isActive =
            typeof lastSeen === "number"
              ? now - lastSeen < ACTIVE_THRESHOLD
              : false;

          if (!podMap.has(pod.pubkey)) {
            // First time seeing this pod
            podMap.set(pod.pubkey, {
              ...pod,
              isActive
            });
          } else {
            // Merge: if ANY RPC sees it active, mark active
            const existing = podMap.get(pod.pubkey);
            podMap.set(pod.pubkey, {
              ...existing,
              isActive: existing.isActive || isActive
            });
          }
        });
      } catch (err) {
        // Silent fail — dashboards NEVER fail hard on bad RPCs
        console.warn(`RPC ${node} failed`);
      }
    })
  );

  const result = Array.from(podMap.values());

  console.log(`[pNodes] Total unique pods: ${result.length}`);
  return result;
}
