import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ check token instead of "user"
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
   
    navigate("/");
    window.location.reload();
  };
   const user = JSON.parse(localStorage.getItem("user"));
    const firstLetter = user ? user.name.charAt(0).toUpperCase() : "";

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <h2 className="text-xl font-bold">Social Hub</h2>

      <div className="flex gap-3">
        {isLoggedIn ? (
          <>
      
            <Link to="/dashboard" className="px-4 py-2 bg-gray-800 rounded">
              Dashboard
            </Link>

            <Link to="/create-post" className="px-4 py-2 bg-gray-800 rounded">
              Create Post
            </Link>

    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full text-white font-bold">
    {firstLetter}
  </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="px-4 py-2 bg-green-500 rounded">
              Login
            </Link>

            <Link to="/" className="px-4 py-2 bg-yellow-500 rounded">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;