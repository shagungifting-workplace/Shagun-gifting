import React from "react";
import { SlCalender } from "react-icons/sl";

const events = [
  {
    name: "Rajesh Kumar",
    type: "Marriage • Grand Palace, Mumbai",
    code: "400001220625091530001",
    mobile: "+91 9876543210",
    envelopes: "45/100",
    budget: "30%",
    amount: "₹15,000",
    members: "200",
    pin: "400001",
    status: "active",
    paymentNote: "Direct Payment (5% + ₹2000)",
  },
 
];

const Events = () => {
  return (
   <div className="px-4 sm:px-8 py-6 bg-white border rounded-xl p-4 sm:p-6">

      
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 mb-6">
          <span role="img" aria-label="calendar">
            <SlCalender />
          </span>
          Event Management
        </h2>

        {/* Event Cards */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg pt-3 sm:pt-4 pb-4 sm:pb-6 px-4 sm:px-6 space-y-4"
            >
              {/* Top Row: Badges above Info on small screens */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-2">
                {/* Host Info */}
                <div className="space-y-1 text-sm">
                  <h3 className="font-bold text-base text-gray-900 mt-0 leading-tight">
                    {event.name}
                  </h3>
                  <p className="text-gray-700">{event.type}</p>
                  <p className="text-gray-500">Project Code: {event.code}</p>
                  <p className="text-gray-500">Mobile: {event.mobile}</p>
                </div>

                {/* Right Badges */}
               <div className="flex flex-wrap sm:flex-col sm:items-end items-start gap-2 text-xs font-medium w-full sm:w-auto">
             <div className="flex flex-wrap sm:flex-nowrap items-center  w-full gap-2">
             {/* Status Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                  event.status === "active"
                    ? "bg-black text-white"
                    : event.status === "complete"
                    ? "bg-white border border-gray-300 text-black"
                    : "bg-gray-200 text-black"
                }`}
              >
                {event.status}
              </span>

            {/* Payment Note Button */}
            <button className="bg-black text-white px-2 py-1 rounded-xl text-xs whitespace-nowrap hover:bg-gray-300">
              {event.paymentNote}
            </button>
          </div>

          </div>



            </div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold">Envelopes</p>
                  <p className="text-black font-semibold">{event.envelopes}</p>
                </div>
                <div>
                  <p className="font-semibold">Budget Usage</p>
                  <p className="text-black font-semibold">{event.budget}</p>
                </div>
                <div>
                  <p className="font-semibold">Amount Collected</p>
                  <p className="text-black font-semibold">{event.amount}</p>
                </div>
                <div>
                  <p className="font-semibold">Expected Members</p>
                  <p className="text-black font-semibold">{event.members}</p>
                </div>
                <div>
                  <p className="font-semibold">PIN Code</p>
                  <p className="font-semibold text-black">{event.pin}</p>
                </div>
              </div>

              {/* Buttons (responsive) */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 text-sm">
                <button className="border rounded px-4 py-2 hover:bg-gray-100 w-full sm:w-auto">
                  View Details
                </button>
                <button className="border rounded px-4 py-2 hover:bg-gray-100 w-full sm:w-auto">
                  Send SMS
                </button>
                {event.status === "active" && (
                  <button className="border rounded px-4 py-2 hover:bg-gray-100 w-full sm:w-auto">
                    Monitor Live
                  </button>
                )}
                <button className="border rounded px-4 py-2 hover:bg-gray-100 w-full sm:w-auto">
                  Check Budget Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default Events;
