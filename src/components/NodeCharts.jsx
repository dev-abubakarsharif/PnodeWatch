import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const NodeCharts = ({ nodes = [] }) => {
  // Flatten nodes -> pods safely, ensuring arrays exist
  const data = nodes
    .flatMap((nodeItem) => Array.isArray(nodeItem?.data?.pods) ? nodeItem.data.pods : [])
    .map((pod) => ({
      address: pod.address ?? "-",
      uptimeHours: pod.uptime ? Number((pod.uptime / 3600).toFixed(2)) : 0,
      storagePercent: pod.storage_usage_percent ? pod.storage_usage_percent * 100 : 0
    }));

  if (data.length === 0) {
    return (
      <p className="text-center mt-6 text-gray-400">
        No chart data available
      </p>
    );
  }

  return (
    <div className="mt-6">
      {/* Uptime Chart */}
      <h2 className="text-xl font-bold mb-2">
        Uptime per Pod (hrs)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="address" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="uptimeHours" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

      {/* Storage Chart */}
      <h2 className="text-xl font-bold mt-6 mb-2">
        Storage Usage (%)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="address" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="storagePercent" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NodeCharts;
