import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [published, setPublished] = useState(0);
  const [scheduled, setScheduled] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Get token
      const token = localStorage.getItem("token");

      // ❌ If no token → redirect to login
      if (!token) {
        window.location.href = "/";
        return;
      }

      // 🔹 Fetch total count WITH TOKEN
      const res = await fetch("http://localhost:5000/api/posts/count", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
      });

      // 🔥 Handle unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch count");
      }

      const data = await res.json();

      setTotalPosts(data.total || data.count || 0);
      setPublished(data.total || data.count || 0);
      setScheduled(0); // future feature

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ❌ Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 🔄 Loading */}
      {loading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Posts */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Total Posts</h2>
            <p className="text-2xl font-bold mt-2">{totalPosts}</p>
          </div>

          {/* Scheduled */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Scheduled</h2>
            <p className="text-2xl font-bold mt-2">{scheduled}</p>
          </div>

          {/* Published */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Published</h2>
            <p className="text-2xl font-bold mt-2">{published}</p>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;