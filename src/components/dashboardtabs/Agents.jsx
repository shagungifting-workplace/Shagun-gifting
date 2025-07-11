import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

const agents = [
  {
    name: "Mumbai Agent 1",
    region: "Mumbai Central",
    pin: "400001",
    phone: "+91 9000000001",
    machines: 5,
  },
  {
    name: "Delhi Agent 1",
    region: "Delhi Central",
    pin: "110001",
    phone: "+91 9000000002",
    machines: 3,
  },
  {
    name: "Pune Agent 1",
    region: "Pune Central",
    pin: "411001",
    phone: "+91 9000000003",
    machines: 4,
  },
];

const Agents = () => {
  return (
    <div className="mt-10 bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center text-lg sm:text-xl font-semibold gap-2 text-gray-800">
        <FaMapMarkerAlt className="text-gray-800" />
        <span>Agent Management (PIN Code Wise)</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {agents.map((agent, index) => (
          <div
            key={index}
            className="border p-4 rounded-xl shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{agent.name}</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-2">{agent.region}</p>

             <div className="text-sm text-gray-700 space-y-2 mt-3">
              <p className="flex justify-between">
                <span className="font-semibold">PIN Code:</span>
                <span>{agent.pin}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Mobile:</span>
                <span>{agent.phone}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold">Active Machines:</span>
                <span>{agent.machines}</span>
              </p>
            </div>

            </div>

                     
          <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-4">
            <button className="flex-1 sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
              <FiMessageSquare /> SMS
            </button>
            <button className="flex-1 sm:w-auto px-4 py-2 rounded border border-gray-300 text-sm font-medium">
              Alert
            </button>
          </div>


          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
