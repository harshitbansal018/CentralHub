import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar"; // ✅ fixed spelling

// Pages
import Post from "./pages/Post";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost"; // ✅ new page for creating posts
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} /> {/* better UX */}
            <Route path="/post" element={<Post />} />
            <Route path="/create-post" element={<CreatePost />} /> {/* reuse Post for create */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Auth />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
};

export default App;