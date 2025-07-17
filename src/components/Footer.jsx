// src/components/Footer.jsx
import React from "react";
import {
    FaInstagram,
    FaXTwitter,
    FaLinkedin,
    FaYoutube,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                {/* Branding */}
                <div className="flex flex-col items-center md:items-start">
                    <img
                        src="/logo.jpg"
                        alt="Shagun Logo"
                        className="md:h-10  md:w-20 h-20 w-48  mb-4"
                    />

                    <p className="text-gray-400">
                        Revolutionizing traditional Indian gifting with modern
                        IoT technology.
                    </p>
                </div>

                {/* For Hosts */}
                <div>
                    <h3 className="text-md font-semibold mb-3">For Hosts</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <Link to="/mobile_ver">Host Registration</Link>
                        </li>
                        <li>
                            <Link to="/hostlogin">Host Login</Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy">Privacy & Policy</Link>
                        </li>
                    </ul>
                </div>

                {/* Features */}
                <div>
                    <h3 className="text-md font-semibold mb-3">Features</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <a href="#">IoT Vending Machines</a>
                        </li>
                        <li>
                            <a href="#">QR Code Payments</a>
                        </li>
                        <li>
                            <a href="#">Real-time Tracking</a>
                        </li>
                        <li>
                            <a href="-#">Mobile Management</a>
                        </li>
                    </ul>
                </div>

                {/* Follow Us */}
                <div className="text-center md:text-left">
                    <h3 className="text-md font-semibold mb-3">Follow Us</h3>
                    <ul className="space-y-3 text-gray-400 flex flex-col items-center md:items-start">
                        <li className="flex items-center gap-3">
                            <FaInstagram className="text-xl" />
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaXTwitter className="text-xl" />
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Twitter (X)
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaLinkedin className="text-xl" />
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaYoutube className="text-xl" />
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                YouTube
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
                © 2025 Shagun. All rights reserved. Traditional gifting, modern
                technology.
            </div>
        </footer>
    );
};

export default Footer;
