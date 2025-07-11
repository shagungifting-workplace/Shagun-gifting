import React from 'react';
import { FaGift, FaArrowLeft, FaCheck } from 'react-icons/fa';
import {Link} from 'react-router-dom';

export default function Event_det() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5ee] to-[#fffaf0]">

            {/* ✅ Navbar */}
            <div className="flex justify-between items-center px-9 py-7 bg-white border-b border-gray-200 gap-3 overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Link to="/">
                        <FaArrowLeft className="text-[16px] text-[#333] cursor-pointer shrink-0" />
                    </Link>
                    <FaGift className="text-[20px] text-orange-600" />
                    <span className="font-semibold text-lg text-orange-600">Shagun</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center">
                            {step}
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-white text-sm font-semibold flex items-center justify-center">
                        4
                    </div>
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-sm flex items-center justify-center">
                        <FaCheck />
                    </span>
                </div>
            </div>

            {/* ✅ Form */}
            <div className="flex justify-center items-center py-10 px-4">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
                    <h2 className="text-2xl font-semibold mb-6">Event Details</h2>

                    <form className="space-y-6">
                        {/* PIN and Venue Name */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col flex-1 min-w-[240px]">
                                <label className="font-medium mb-1">PIN Code (Venue) *</label>
                                <input
                                    type="text"
                                    placeholder="Enter venue PIN code"
                                    required
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[240px]">
                                <label className="font-medium mb-1">Venue Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Venue Address *</label>
                            <textarea
                                required
                                className="p-2 border rounded-md min-h-[80px] resize-none"
                            ></textarea>
                        </div>

                        {/* Date and Time */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col flex-1 min-w-[200px]">
                                <label className="font-medium mb-1">Event Date *</label>
                                <input
                                    type="date"
                                    required
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[200px]">
                                <label className="font-medium mb-1">Start Time *</label>
                                <input
                                    type="time"
                                    required
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[200px]">
                                <label className="font-medium mb-1">End Time *</label>
                                <input
                                    type="time"
                                    required
                                    className="p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Event No. and Hero/Heroine */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col flex-1 min-w-[240px]">
                                <label className="font-medium mb-1">Event Number (Sl.No. in the same Venue) *</label>
                                <input
                                    type="number"
                                    placeholder="Event sequence number"
                                    min="1"
                                    step="1"
                                    required
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-[240px]">
                                <label className="font-medium mb-1">Names of Hero/Heroine *</label>
                                <input
                                    type="text"
                                    placeholder="Enter names"
                                    required
                                    className="p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Link to="/budget_bank">
                        <button
                            type="submit"
                            className="w-full bg-[#0a0e2a] text-white font-medium text-lg py-3 rounded-md hover:bg-[#141a3a] transition-colors"
                        >
                            Continue
                        </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
