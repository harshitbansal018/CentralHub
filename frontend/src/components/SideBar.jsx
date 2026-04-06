import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-gray-100 p-5">
      <h3 className="text-lg font-semibold mb-4">Menu</h3>

      <ul className="flex flex-col gap-3">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/create-post">Create Post</Link>
        </li>
        <li>
          <Link to="/post">Posts</Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;