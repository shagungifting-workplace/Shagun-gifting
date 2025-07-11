import React from 'react';
import { FaArrowLeft, FaCheck, FaGift } from "react-icons/fa";
import giftIcon from './../assets/react.svg'; // Replace with actual gift icon
import phoneIcon from './../assets/react.svg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Mobile_ver() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fef4f2] via-[#fdf7f4] to-[#fefae9]">
            {/* Navbar */}
            <div className="flex justify-between items-center px-5 py-3 bg-white border-b border-[#eee] gap-3 flex-nowrap overflow-x-auto">
                <div className="flex items-center gap-2 shrink-0 min-w-0">
                    <Link to="/">
                    <FaArrowLeft className="text-[16px] text-[#333] cursor-pointer shrink-0" />
                    </Link>
                    <FaGift className="text-[20px] text-[#f45b0b] shrink-0" />

                    <span className="font-semibold text-[1.2rem] text-[#f45b0b] whitespace-nowrap sm:text-[1rem] xs:text-[0.9rem]">Shagun</span>

                </div>
                <div className="flex items-center gap-2 shrink-0 min-w-0">
                    <div className="w-[26px] h-[26px] rounded-full bg-[#f45b0b] text-white text-[14px] font-semibold flex items-center justify-center shrink-0 xs:w-[20px] xs:h-[20px] xs:text-[10px]">1</div>
                    <div className="w-[24px] h-[24px] rounded-full bg-[#e6e6e6] text-[#555] text-[13px] flex items-center justify-center shrink-0 xs:w-[20px] xs:h-[20px] xs:text-[10px]">2</div>
                    <div className="w-[24px] h-[24px] rounded-full bg-[#e6e6e6] text-[#555] text-[13px] flex items-center justify-center shrink-0 xs:w-[20px] xs:h-[20px] xs:text-[10px]">3</div>
                    <div className="w-[24px] h-[24px] rounded-full bg-[#e6e6e6] text-[#555] text-[13px] flex items-center justify-center shrink-0 xs:w-[20px] xs:h-[20px] xs:text-[10px]">4</div>
                    <span className="w-[24px] h-[24px] rounded-full bg-[#e6e6e6] text-[#555] text-[13px] flex items-center justify-center shrink-0 xs:w-[20px] xs:h-[20px] xs:text-[10px]">
                        <FaCheck />
                    </span>
                </div>
            </div>

            {/* Form Card */}
            <div className="flex justify-center items-center px-5 py-10 sm:py-8 sm:px-4">
                <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-md text-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <img src={giftIcon} alt="gift" className="w-[50px] h-[50px] p-2 bg-gradient-to-br from-[#ff9240] to-[#ff5d5d] rounded-xl sm:w-[40px] sm:h-[40px] sm:p-2" />
                        <img src={phoneIcon} alt="phone" className="w-[50px] h-[50px] p-2 bg-gradient-to-br from-[#ff9240] to-[#ff5d5d] rounded-xl sm:w-[40px] sm:h-[40px] sm:p-2" />
                    </div>
                    <h2 className="text-[1.5rem] font-semibold text-[#111] mb-5 sm:text-[1.3rem]">Mobile Verification</h2>

                    <label className="block text-left mb-1 text-[0.95rem] text-[#111] font-medium">Mobile Number *</label>
                    <input type="text" placeholder="Enter 10-digit mobile number" className="w-full p-3 mb-4 border border-[#ddd] rounded-lg text-base sm:text-[0.95rem]" />

                    <label className="block text-left mb-1 text-[0.95rem] text-[#111] font-medium">Email (Optional)</label>
                    <input type="email" placeholder="Enter email address" className="w-full p-3 mb-4 border border-[#ddd] rounded-lg text-base sm:text-[0.95rem]" />

                    <button className="w-full p-3 bg-gradient-to-r from-[#ff7a2d] to-[#f53d3d] text-white text-base rounded-lg mb-5 cursor-pointer sm:text-[0.95rem]">Send OTP</button>

                    <label className="block text-left mb-1 text-[0.95rem] text-[#111] font-medium">Enter OTP</label>
                    <input type="text" placeholder="Enter 6-digit OTP" className="w-full p-3 mb-4 border border-[#ddd] rounded-lg text-base sm:text-[0.95rem]" />

                    <Link to="/personal_det">
                    <button className="w-full p-3 bg-[#0e132a] text-white text-base rounded-lg cursor-pointer sm:text-[0.95rem]">Verify OTP</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
