import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiCpu } from "react-icons/fi";

const machines = [
  {
    id: "M001",
    location: "Grand Palace, Mumbai",
    agent: "Mumbai Agent 1",
    battery: 85,
    envelopes: "55/100",
    lastSync: "2 mins ago",
    status: "active",
  },
  {
    id: "M002",
    location: "Celebration Hall, Delhi",
    agent: "Delhi Agent 1",
    battery: 92,
    envelopes: "100/100",
    lastSync: "5 mins ago",
    status: "idle",
  },
  {
    id: "M003",
    location: "Shanti Villa, Pune",
    agent: "Pune Agent 1",
    battery: 45,
    envelopes: "200/200",
    lastSync: "1 hour ago",
    status: "maintenance",
  },
];

const statusStyles = {
  active: {
    color: "bg-green-500",
    label: "active",
    bg: "bg-gray-900 text-white",
  },
  idle: {
    color: "bg-yellow-400",
    label: "idle",
    bg: "bg-gray-100 text-black",
  },
  maintenance: {
    color: "bg-red-500",
    label: "maintenance",
    bg: "bg-red-600 text-white",
  },
};

const IoTMachines = () => {
  return (
    <div className="p-6 bg-white border border-gray-300 rounded-xl">
      {/* Header */}
      <div className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <span className="text-black"><FiCpu /></span>
        IoT Machine Management
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine, idx) => {
          const status = statusStyles[machine.status];
          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-5 shadow-sm relative flex flex-col justify-between border"
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{machine.id}</h3>
                {/* Status badge with dot outside */}
                <div className="relative pl-4">
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${status.color}`}
                  ></span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Location & Agent */}
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-500" />
                  {machine.location}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Agent:</span>{" "}
                  {machine.agent}
                </p>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-700 space-y-1 mb-4 flex flex-col ">
                <p className="flex flex-row justify-between">
                  <span className="font-semibold ">Battery:</span>{" "}
                  <span
                    className={`${
                      machine.battery < 50
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {machine.battery}%
                  </span>
                </p>
                <p className="flex flex-row justify-between">
                  <span className="font-semibold">Envelopes:</span>{" "}
                  <span className="text-black">{machine.envelopes}</span>
                </p>
                <p className="flex flex-row justify-between">
                  <span className="font-semibold">Last Sync:</span>{" "}
                  <span className="text-black">{machine.lastSync}</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button className="px-4 py-2 border rounded text-sm hover:bg-gray-100">
                  Restart
                </button>
                <button className="px-4 py-2 border rounded text-sm hover:bg-gray-100">
                  Refill
                </button>
                <button className="px-4 py-2 border rounded text-sm hover:bg-gray-100">
                  Alert Agent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IoTMachines;
