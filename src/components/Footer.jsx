import { FaInstagram, FaLinkedin, FaYoutube, } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-5 text-center md:text-left">
                {/* Branding */}
                <div className="flex flex-col items-center md:items-start">
                    <img
                        src="/logo.png"
                        alt="Shagun Logo"
                        className="md:h-12 md:w-24 h-20 w-48  mb-4"
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

                {/* Quick Links */}
                <div>
                    <h3 className="text-md font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-3 text-gray-400 flex flex-col items-center md:items-start">
                        <li className="flex items-center gap-3">
                            <a
                                href="about"
                                rel="noopener noreferrer"
                            >
                                About Us
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <a
                                href="services"
                                rel="noopener noreferrer"
                            >
                                Our Services
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <a
                                href="/contact"
                                rel="noopener noreferrer"
                            >
                                Contact Us
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
