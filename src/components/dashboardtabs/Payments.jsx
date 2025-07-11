import React from "react";
import { FaCreditCard, FaClock } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const revenueStats = [
  {
    title: "Total Revenue",
    value: "₹12,45,000",
    sub: "This month",
    icon: <FaIndianRupeeSign className="text-green-600" />,
  },
  {
    title: "Pending Refunds",
    value: "12",
    sub: "₹24,000 total",
    icon: <FaCreditCard className="text-orange-500" />,
  },
  {
    title: "Settlement Queue",
    value: "0",
    sub: "All direct payments",
    icon: <FaClock className="text-purple-500" />,
  },
];

const directTransactions = [
  {
    name: "Rajesh Kumar",
    detail: "UPI: rajesh@paytm",
    amount: "₹15,000",
    fee: "5% + ₹2,000 fee",
  },
];

const settlementHistory = [
  {
    title: "Host Payment – Event #400002",
    detail: "UPI Transaction",
    amount: "₹6,000",
    time: "2 mins ago",
  },
];

const Payments = () => {
  return (
    <div className="p-6 bg-[#fff5ee] space-y-4">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {revenueStats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm flex items-start gap-3 justify-between max-w-xl"
          >
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.title}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
              <p className="text-sm text-gray-500">{item.sub}</p>
            </div>
            <div className="text-xl">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Direct Payments */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {directTransactions.map((tx, index) => (
            <div
              key={index}
              className="bg-green-50 flex items-center justify-between p-3 rounded-md"
            >
              <div>
                <p className="font-semibold">{tx.name}</p>
                <p className="text-sm text-gray-600">{tx.detail}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{tx.amount}</p>
                <p className="text-xs text-gray-500">{tx.fee}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement History */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {settlementHistory.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 flex items-center justify-between p-3 rounded-md"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{item.amount}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments;
