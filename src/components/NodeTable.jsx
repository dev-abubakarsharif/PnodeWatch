const NodeTable = ({ nodes = [] }) => {
  const formatStorage = (bytes) =>
    `${Math.round((bytes ?? 0) / 1024 ** 3)}GB`;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-[900px] w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-right">Uptime (hrs)</th>
            <th className="px-4 py-2 text-right">Storage</th>
            <th className="px-4 py-2 text-center">Version</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700">
          {nodes.map((pod) => (
            <tr
              key={pod.pubkey || pod.address}
              className="hover:bg-gray-700 transition"
            >
              <td className="px-4 py-2 truncate max-w-[220px]">
                {pod.address}
              </td>

              <td className="px-4 py-2 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pod.isActive
                      ? "bg-blue-900 text-blue-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {pod.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-4 py-2 text-right">
                {((pod.uptime ?? 0) / 3600).toFixed(1)}
              </td>

              <td className="px-4 py-2 text-right">
                {formatStorage(pod.storage_committed)}
              </td>

              <td className="px-4 py-2 text-center">
                {pod.version ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NodeTable;
