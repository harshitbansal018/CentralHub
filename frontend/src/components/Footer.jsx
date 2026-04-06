import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left */}
        <h2 className="text-lg font-semibold">
          © {new Date().getFullYear()} Social Hub
        </h2>

        {/* Center */}
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-gray-400">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-400">
            Terms
          </a>
          <a href="#" className="hover:text-gray-400">
            Contact
          </a>
        </div>

        {/* Right */}
        <div className="flex gap-4 mt-3 md:mt-0">
          <span className="text-gray-400">Follow:</span>
          <a href="#" className="hover:text-blue-400">
            Instagram
          </a>
          <a href="#" className="hover:text-blue-400">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;