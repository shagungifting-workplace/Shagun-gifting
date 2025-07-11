import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import logo from '../assets/shagunicon.png';

const Host_dash = () => {
    return (
        <div className="min-h-screen bg-[#ffd6dc]">
            {/* ✅ Top Bar */}
            <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-[#f2c0a2] rounded-t-xl">
                <a href="#" className="text-[#e56a1d] text-base font-medium hover:underline">
                    &#8592; Back to Home
                </a>
                <img src={logo} alt="Shagun Logo" className="h-[50px]" />
            </div>

            {/* ✅ Main Container */}
            <div className="flex justify-center items-start py-8 px-4">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-[500px] p-5 space-y-6">

                    <h3 className="text-center text-xl font-semibold text-gray-800">Event Summary & Dashboard</h3>

                    {/* Welcome Box */}
                    <div className="bg-[#ffe5ea] rounded-lg p-4 text-center">
                        <p>Welcome back,</p>
                        <h3 className="text-lg font-semibold">SHIVA PRASAD</h3>
                        <p className="text-xs text-gray-600">User ID: 17986135753909948458</p>
                    </div>

                    {/* Project Code */}
                    <div className="bg-[#f8f8f8] rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2">📌 Project Code</h4>
                        <div className="bg-[#f2f2f2] p-2 rounded-md text-center font-mono">500019-20250708-0225-2</div>
                        <p className="text-xs text-center text-gray-600 mt-1">PIN + Date (YYYYMMDD) + Time (HHMM) + Event No.</p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-1">
                        <h4 className="font-semibold text-base">📋 Event Details</h4>
                        <ul className="text-sm leading-6">
                            <li><strong>Event Type:</strong> Marriage</li>
                            <li><strong>Side:</strong> Bride</li>
                            <li><strong>Heroine Name:</strong> XYZ</li>
                            <li><strong>Event No.:</strong> 2</li>
                            <li><strong>Date:</strong> 2025-07-08</li>
                            <li><strong>Time:</strong> 02:25</li>
                            <li><strong>Venue:</strong> HOTEL GRAND SITARA</li>
                            <li><strong>Guests:</strong> 200</li>
                            <li><strong>Total Budget:</strong> ₹ 1,00,000</li>
                        </ul>
                    </div>

                    {/* Financial Overview */}
                    <div className="space-y-1">
                        <h4 className="font-semibold text-base">💲 Financial Overview</h4>
                        <ul className="text-sm leading-6">
                            <li><strong>UPI Collected:</strong> ₹ 18,000</li>
                            <li><strong>Utilized Budget:</strong> ₹ 18,000</li>
                            <li><strong>Initial Platform Fee Paid:</strong> ₹ 5,000</li>
                            <li><strong>Recharge Payments:</strong> ₹ 0</li>
                        </ul>
                    </div>

                    {/* UPI Details */}
                    <div className="space-y-1">
                        <h4 className="font-semibold text-base">📱 Your UPI Details for Gifts</h4>
                        <p>QR Code for "QR.jpg" would be displayed here from storage.</p>
                        <p><strong>UPI ID:</strong> shiva4sap1@okicici</p>
                        <p><strong>Bank A/C:</strong> 6123456789</p>
                        <p><strong>IFSC:</strong> ICIC0006306</p>
                        <small className="text-xs text-gray-600">These are your details for guests to send gifts via UPI.</small>
                    </div>

                    {/* Envelope Usage & Recharge */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-base">🎁 Envelope Usage</h4>
                        <p className="text-xl font-bold">0/200</p>
                        <p className="text-xs text-gray-600">Number of envelopes disbursed from kiosk (Simulated).</p>
                        <input type="number" className="w-full border p-2 rounded-md mt-1" placeholder="Enter amount to extend budget" />
                        <button className="w-full mt-2 bg-[#a11d1d] text-white font-bold py-2 rounded-md hover:bg-[#8e1818]">
                            Recharge Budget (Pay 5% Service Fee)
                        </button>
                    </div>

                    {/* Guests Paid */}
                    <div className="space-y-1">
                        <h4 className="font-semibold text-base">🧾 Guests Who Paid</h4>
                        <p className="text-sm text-gray-700">List of guests who paid via UPI will appear here. (Future Feature)</p>
                        <ul className="list-disc pl-5 text-sm">
                            <li>Guest Name 1 - ₹500</li>
                            <li>Guest Name 2 - ₹1000</li>
                            <li>Guest Name 3 - ₹200</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Host_dash;
