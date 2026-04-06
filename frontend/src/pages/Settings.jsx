import React from "react";

const Settings = () => {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-2 border rounded"
          />
        </div>

        <button className="bg-black text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
