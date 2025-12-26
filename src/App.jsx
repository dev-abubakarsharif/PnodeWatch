import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import NodeTable from "./components/NodeTable.jsx";
import NodeCharts from "./components/NodeCharts.jsx";
import ActiveInactiveDonut from "./components/ActiveInactiveDonut.jsx";
import axios from "axios";

function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getData = async () => {
      try {
        const res = await axios.get("/api/pnodes");
        if (!mounted) return;
        setNodes(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch pNodes:", err);
        setNodes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getData();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-gray-700 rounded-full" />
              <div className="absolute top-0 left-0 w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 tracking-wide">Analyzing pNode network…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="flex justify-center lg:justify-start">
              <ActiveInactiveDonut nodes={nodes} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <NodeTable nodes={nodes} />
              <NodeCharts nodes={nodes} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
