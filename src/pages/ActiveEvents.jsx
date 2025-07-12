import React from 'react';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
const ActiveEvents = () => {
  const projects = [
    {
      code: '500081170624145301',
      host: 'Raheja Gardenia',
      distributed: 50,
      total: 100,
      status: 'Running',
      refund: '10:000',
      iot: 'Working'
    },
    {
      code: '110034170624193012',
      host: 'Rohit Kumar',
      distributed: 20,
      total: 100,
      status: 'Upcoming',
      refund: '',
      iot: 'Not Working'
    },
    {
      code: '56000216082409027',
      host: 'Shyam Sunder',
      distributed: 75,
      total: 100,
      status: 'Running',
      refund: '100:000',
      iot: 'Working'
    },
    {
      code: '302017140724171830',
      host: 'Mehta Party',
      distributed: 5,
      total: 100,
      status: 'Running',
      refund: '',
      iot: 'Agent SMS'
    },
    {
      code: '30101714072417',
      host: 'Mehta Party',
      distributed: 50,
      total: 100,
      status: 'Upcoming',
      refund: 'Working',
      iot: 'Working'
    }
  ];

  return (
    <div className="bg-[#fdf6ed] min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#4a0f23] rounded-t-lg p-4">
        <h1 className="text-2xl font-bold text-[#ccbf95]">SHAGUN</h1>
        <button className="bg-[#ccbf95] text-[#4a0f23] px-4 py-2 rounded-md hover:bg-yellow-700">Download Report</button>
      </div>

      <div className="bg-white p-2 ">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-[#f5f1e6] text-center p-4 rounded-lg ">
            <h2 className="text-3xl font-bold">84</h2>
            <p className="text-gray-600">Running Projects</p>
          </div>
          <div className="bg-[#f5f1e6] text-center p-4 rounded-lg">
            <h2 className="text-3xl font-bold">12</h2>
            <p className="text-gray-600">Upcoming Projects</p>
          </div>
          <div className="bg-[#f5f1e6] text-center p-4 rounded-lg">
            <h2 className="text-3xl font-bold">215</h2>
            <p className="text-gray-600">Closed Projects</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-between ">
          <div>
            <h1 className="font-bold text-xl">Project</h1>
          </div>
          <div className="mb-4 relative w-1/3 max-w-sm">
          <input
            type="text"
            placeholder="Search code or host..."
            className="w-full p-2 pr-10 border border-gray-300 rounded-md"
          />
          <IoSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
        </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-[#fcf4ea] text-gray-600 uppercase text-sm">
                <th className="p-3">Project Code</th>
                <th className="p-3">Host</th>
                <th className="p-3">Envelopes Distributed</th>
                <th className="p-3">Status</th>
                <th className="p-3">Refund</th>
                <th className="p-3">IoT Machine</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, i) => (
                <tr key={i} className="border-t text-sm">
                  <td className="p-3">
                    <Link
                      to={`/project/${proj.code}`}
                      className="text-[#4a0f23] font-semibold hover:underline"
                    >
                      {proj.code}
                    </Link>
                  </td>
                  <td className="p-3 font-semibold whitespace-nowrap">{proj.host}</td>
                  <td className="p-3 w-56">
                    <div className="relative bg-[#f3eadd] h-4 rounded-full">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${proj.status === "Running" ? "bg-[#5e2120]" : "bg-[#c7985d] "}`}
                        style={{ width: `${(proj.distributed / proj.total) * 100}%` }}
                      ></div>
                      <div className="absolute right-1 top-0 text-xs font-semibold">
                        {proj.distributed}/{proj.total}
                      </div>
                    </div>
                  </td>
                  <td
                  className={`p-3 font-medium ${
                    proj.status === "Running" ? "text-[#5e2120]" :
                    proj.status === "Upcoming" ? "text-yellow-600" :
                    "text-gray-700"
                  }`}
                >
                  {proj.status}
                </td>

                  <td className="p-3 text-gray-700">{proj.refund}</td>
                  <td className="p-3">
                    {proj.iot === 'Working' && <span className="text-green-600 font-semibold">Working</span>}
                    {proj.iot === 'Not Working' && <span className="text-red-500 font-semibold whitespace-nowrap">Not Working</span>}
                    {proj.iot === 'Agent SMS' && (
                      <span className="bg-[#d5c286] text-black text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        Agent SMS
                      </span>

                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveEvents;
