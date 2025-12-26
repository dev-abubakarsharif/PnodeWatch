import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ActiveInactiveDonut = ({ nodes = [] }) => {
  // Ensure nodes is an array of pod objects
  const pods = Array.isArray(nodes) ? nodes : [];

  // Count active and inactive pods safely
  const active = pods.filter((p) => p?.isActive).length;
  const inactive = pods.length - active;

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-xl p-4">
      {/* Chart Container */}
      <div className="relative h-64 w-full">
        <Doughnut
          data={{
            labels: ["Active", "Inactive"],
            datasets: [
              {
                data: [active, inactive],
                backgroundColor: ["#2563eb", "#dc2626"],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: { legend: { display: false } },
          }}
        />
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-sm">Total Nodes</p>
          <p className="text-3xl font-bold text-white">{pods.length}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="text-blue-500">● Active: {active}</span>
        <span className="text-red-500">● Inactive: {inactive}</span>
      </div>
    </div>
  );
};

export default ActiveInactiveDonut;
