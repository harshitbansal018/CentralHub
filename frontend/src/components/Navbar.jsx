import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <h2 className="text-xl font-bold">Social Hub</h2>

      <div className="flex gap-3">
        <Link to="/dashboard" className="px-4 py-2 bg-gray-800 rounded">
          Dashboard
        </Link>

        <Link to="/create-post" className="px-4 py-2 bg-gray-800 rounded">
          Create Post
        </Link>

        <Link to="/" className="px-4 py-2 bg-red-500 rounded">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;