import React from "react";
const Analytics = () => {
  return (
    <div className="space-y-6 mt-6">
     
      {/* Top Section: Revenue + Event Distribution */}
    {/* Top Section: Revenue + Event Distribution */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Revenue Trends */}
  <div className="bg-white p-6 rounded-xl shadow-sm h-[300px] flex flex-col">
    <h2 className="text-xl font-medium mb-4">Revenue Trends</h2>
    <div className="bg-gray-100 flex-1 rounded-lg flex items-center justify-center text-gray-500">
      Revenue Chart Placeholder
    </div>
  </div>

  {/* Event Distribution */}
  <div className="bg-white p-6 rounded-xl shadow-sm h-[300px] flex flex-col">
    <h2 className="text-xl font-medium mb-4">Event Types Distribution</h2>
    <div className="flex-1 overflow-y-auto">
      <ul className="space-y-2 text-gray-700 text-sm">
        <li className="flex justify-between">
          <span>Marriage</span>
          <span>65%</span>
        </li>
        <li className="flex justify-between">
          <span>Birthday</span>
          <span>20%</span>
        </li>
        <li className="flex justify-between">
          <span>House Warming</span>
          <span>10%</span>
        </li>
        <li className="flex justify-between">
          <span>Others</span>
          <span>5%</span>
        </li>
      </ul>
    </div>
  </div>
</div>



      {/* Bottom Section: Performance Metrics */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 text-center p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">98.5%</p>
            <p className="text-gray-600">Machine Uptime</p>
          </div>
          <div className="bg-green-50 text-center p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">4.8</p>
            <p className="text-gray-600">Avg Rating</p>
          </div>
          <div className="bg-orange-50 text-center p-4 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">2.3s</p>
            <p className="text-gray-600">Avg Response Time</p>
          </div>
          <div className="bg-purple-50 text-center p-4 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">95%</p>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
