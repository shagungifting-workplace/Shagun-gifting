import React, { useEffect, useState } from "react";
import { IoGiftOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { LuSmartphone, LuQrCode, LuShield } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

// images
import sliderImg1 from '../assets/slider_img1.jpg';
import sliderImg2 from '../assets/slider_img2.jpg';
import sliderImg3 from '../assets/slider_img3.jpg';
import sliderImg4 from '../assets/slider_img4.jpg';
import sliderImg5 from '../assets/about_us.png';
import sliderImg6 from '../assets/image6.webp';
import { MdContactMail } from "react-icons/md";

// ImageSlider component
const images = [sliderImg1, sliderImg2, sliderImg3, sliderImg4, sliderImg2, sliderImg5, sliderImg6];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const getVisibleImages = () => {
        const indices = [];
        for (let i = -3; i <= 3; i++) {
            const index = (currentIndex + i + images.length) % images.length;
            indices.push(index);
        }
        return indices;
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex justify-center items-center transition-transform duration-700 ease-in-out">
                <div className="flex gap-4 md:gap-8 lg:gap-16">
                    {getVisibleImages().map((imageIndex, i) => {
                        const isCenter = i === 3;
                        return (
                            <div
                                key={`${imageIndex}-${i}`}
                                className={`
                                    transition-all duration-700 transform w-[120px] sm:w-[180px] md:w-[240px] lg:w-[270px] 
                                    ${isCenter ? "scale-100 opacity-100 z-10" : "scale-100 opacity-40"} ease-in-out 
                                    ${i === 0 || i === 6 ? "hidden sm:block opacity-0 scale-90" : ""} rounded-xl overflow-hidden
                                `}
                            >
                                <img
                                    src={images[imageIndex]}
                                    alt={`Slide ${imageIndex}`}
                                    className="w-full h-full object-cover rounded-xl shadow-lg"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="text-center" id="home">
            {/* Hero Section */}
            <section className="px-6 py-8 bg-[#fef3eb]">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#e54d26]">
                    Modernize Traditional <br /> Indian Gifting
                </h1>
                <p className="text-[#4b5563] max-w-2xl mx-auto mb-6 md:text-xl">
                    Transform envelope gifting at weddings and celebrations with
                    our IoT-enabled vending machines. Secure, traceable, and
                    convenient.
                </p>
                <div className="flex justify-center w-fit items-center mx-auto sm:gap-10 gap-5 sm:flex-row flex-col mb-5">
                    <button
                        onClick={() => navigate("/hostlogin")}
                        className="flex items-center gap-2 border border-[#fa541c] py-2 px-6 rounded-lg bg-white text-[#a44b2e] hover:bg-gray-100"
                    >
                        <IoGiftOutline />
                        Register as Host
                    </button>

                    <button
                        onClick={() => navigate("/contact")}
                        className="flex items-center gap-2 border border-[#fa541c] py-2 px-6 rounded-lg bg-white text-[#a44b2e] hover:bg-gray-100"
                    >
                        <MdContactMail />
                        Enquiry Now
                    </button>
                </div>
                {/* Image Slider Section */}
                <div className="max-w-[1100px] mx-auto mt-">
                    {/*<h3 className="text-2xl font-semibold mb-6 text-orange-700">What It Looks Like</h3>*/}
                    <div className="w-full flex justify-center items-center overflow-hidden shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer p-9 rounded-xl ">
                        <ImageSlider />
                    </div>
                </div>
            </section>

            {/* Why Choose Shagun Section */}
            <section className="bg-[#fcf9f9] py-12 px-6">
                <h3 className="text-4xl font-bold mb-6 text-center text-black">
                    Why Choose Shagun?
                </h3>
                <p className="text-gray-700 text-xl max-w-2xl mx-auto mb-12 text-center">
                    Combining traditional values with modern technology for
                    seamless gifting experiences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                    <div className="border border-orange-300 bg-white p-8 rounded-xl max-w-md w-full mx-auto text-left transform md:transition md:duration-500 md:hover:scale-125 md:hover:z-10 md:hover:shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer">
                        <LuSmartphone className="text-orange-600 text-5xl mb-4 bg-orange-100 px-1 py-1 rounded-xl" />
                        <h4 className="font-semibold text-xl mb-2">Mobile-First Design</h4>
                        <p className="text-gray-600">
                            Easy registration and management through our mobile-optimized platform.
                            No complex setups required.
                        </p>
                    </div>

                    <div className="border border-orange-300 bg-white p-8 rounded-xl max-w-md w-full mx-auto text-left transform md:transition md:duration-500 md:hover:scale-125 md:hover:z-10 md:hover:shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer">
                        <LuQrCode className="text-red-700 bg-pink-200 px-1 py-1 rounded-xl text-5xl mb-4" />
                        <h4 className="font-semibold text-xl mb-2">QR Code Payments</h4>
                        <p className="text-gray-600">
                            Guests scan QR codes to make payments directly to your UPI account.
                            Instant, secure, and traceable.
                        </p>
                    </div>

                    <div className="border border-orange-300 bg-white p-8 rounded-xl max-w-md w-full mx-auto text-left transform md:transition md:duration-500 md:hover:scale-125 md:hover:z-10 md:hover:shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer">
                        <LuShield className="text-yellow-600 text-5xl bg-yellow-200 px-1 py-2 rounded-xl mb-4" />
                        <h4 className="font-semibold text-xl mb-2">Secure & Reliable</h4>
                        <p className="text-gray-600">
                            Bank-grade security with real-time monitoring. Your money and data are
                            always protected.
                        </p>
                    </div>
                </div>

            </section>

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-orange-400 to-red-600 text-white pt-16 pb-20 px-6">
                <h3 className="text-4xl font-bold mb-4">
                    Ready to Transform Your Event?
                </h3>
                <p className="text-lg mb-6 max-w-xl mx-auto">
                    Join thousands of hosts who trust Shagun for their special
                    occasions.
                </p>
                <div className="flex justify-center mt-6">
                    <Link to="/hostlogin">
                        <button className="flex items-center gap-2 bg-white text-orange-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">
                            Get Started Today <IoIosArrowForward />
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
