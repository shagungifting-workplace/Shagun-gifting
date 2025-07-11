import React from "react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";

const hosts = [
  {
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    pan: "ABCDE1234F",
    aadhaar: "1234 5678 9012",
    pin: "400001",
    upi: "rajesh@paytm",
    isVerified: true,
    directPayment: true,
    events: 1,
  },
  {
    name: "Priya Sharma",
    phone: "+91 9876543211",
    pan: "FGHIJ5678K",
    aadhaar: "5678 9012 3456",
    pin: "110001",
    bank: {
      name: "HDFC Bank",
      account: "1234567890",
      ifsc: "HDFC0001234",
    },
    isVerified: true,
    directPayment: true,
    events: 1,
  },
];

const Hosts = () => {
  return (
    <div className="mt-10 bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center text-lg sm:text-xl font-semibold gap-2 text-gray-800">
        <MdOutlinePeopleAlt className="text-gray-800" />
        <span>Host Management</span>
      </div>

      {hosts.map((host, index) => (
        <div
          key={index}
          className="border rounded-xl px-4 sm:px-6 py-4 shadow-sm bg-white space-y-4"
        >
          {/* Responsive Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            {/* Right side on desktop, top on mobile */}
            <div className="sm:order-2 flex flex-col sm:items-end items-start gap-1 text-sm w-full sm:w-auto">
              <div className="flex flex-wrap gap-2">
                {host.isVerified && (
                  <span className="border text-xs border-gray-200 px-2 py-1 rounded-full whitespace-nowrap">
                    Verified
                  </span>
                )}
                {host.directPayment && (
                  <span className="bg-black text-xs text-white px-2 py-1 rounded-full whitespace-nowrap">
                    Direct Payment
                  </span>
                )}
              </div>
              <span className="text-gray-600 text-xs">Events: {host.events}</span>
            </div>

            {/* Left side on desktop, bottom on mobile */}
            <div className="sm:order-1">
              <h3 className="text-base sm:text-lg font-semibold text-black">
                {host.name}
              </h3>
              <p className="text-gray-600 text-sm">Phone: {host.phone}</p>
              <p className="text-gray-600 text-sm">PAN: {host.pan}</p>
              <p className="text-gray-600 text-sm">Aadhaar: {host.aadhaar}</p>
              <p className="text-gray-600 text-sm">PIN: {host.pin}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-sm">
            <p className="font-semibold text-black text-sm">Payment Details:</p>
            {host.upi ? (
              <p>UPI ID: {host.upi}</p>
            ) : (
              <>
                <p>Bank: {host.bank.name}</p>
                <p>Account: {host.bank.account}</p>
                <p>IFSC: {host.bank.ifsc}</p>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 sm:flex-row text-sm">
            <button className="flex items-center justify-center gap-1 px-4 py-2 rounded border hover:bg-gray-100 text-black font-medium w-full sm:w-auto">
              <FiMessageSquare /> SMS
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-100 text-black font-medium w-full sm:w-auto">
              View Profile
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-100 text-black font-medium w-full sm:w-auto">
              Transaction History
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-100 text-black font-medium w-full sm:w-auto">
              Recharge/Extension
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hosts;
