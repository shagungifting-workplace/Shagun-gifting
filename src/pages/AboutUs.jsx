import React, { useEffect, useState } from "react";
import aboutImage from "../assets/about_us.png"; 

const missionPoints = [
    "Empower hosts with plug-and-play kiosks that marry age-old customs to secure UPI flows",
    "Delight guests through instant, contactless gifting that honors ritual and reduces friction.",
    "Deliver transparent, real-time analytics so hosts can focus on celebration, not spreadsheets.",
    "Foster partnerships with venues and decorators to make Shagun an integral part of every Indian festivity.",
];

const AboutUs = () => {
    const [visibleIndex, setVisibleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleIndex((prev) =>
                prev < missionPoints.length ? prev + 1 : prev
            );
        }, 2000); // 2 seconds delay between points

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-[#fef3eb]">
            {/* ABOUT US Section */}
            <section className="px-6 sm:px-12 lg:px-24 lg:py-12 sm:py-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row lg:gap-x-16 md:gap-x-12 items-start ">
                    {/* Text Content */}
                    <div className="flex-1">
                        <h2 className="sm:text-3xl text-2xl md:text-start text-center font-bold text-[#f45b0b] mb-4">
                            About Us
                        </h2>
                        <p className="text-gray-800 text-justify lg:text-base text-sm mb-6 leading-relaxed">
                            <strong>Shagun</strong> was born from a simple idea:
                            blend centuries-old Indian gifting traditions with
                            the convenience of modern digital payments. At
                            weddings and cultural celebrations, guests cherish
                            the ritual of offering a gift—but counting cash,
                            finding envelopes, and manual reconciliation slow
                            down the joy. Shagun’s IoT-enabled envelope vending
                            kiosks, backed by real-time UPI payments and live
                            dashboards, deliver a seamless experience for hosts
                            and guests alike. Our platform empowers hosts to
                            prepay a small service fee, then watch guests scan,
                            pay, and receive beautifully crafted envelopes—while
                            our system handles all the heavy lifting: secure
                            transactions, automated dispensing, and instant
                            reconciliation.
                        </p>
                        <p className="text-gray-800 text-justify lg:text-base text-sm leading-relaxed">
                            Over 2025, we piloted Shagun across Hyderabad’s top
                            venues, earning rave feedback for reliability,
                            transparency, and elegance. Today, we continue to
                            refine our offering—adding premium envelope designs,
                            24/7 support, and deep analytics—so every
                            celebration feels both rooted in tradition and
                            powered by innovation.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="flex-1 flex justify-center mt-12 ">
                        <img
                            src={aboutImage}
                            alt="Shagun Reconcile Analytics"
                            className="xl:size-[40%] md:size-full rounded-xl object-cover shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* OUR VISION Section */}
            <section className="bg-gradient-to-r from-orange-400 to-red-600 py-12 md:py-16 text-center text-white px-6 sm:px-10 lg:px-24 ">
                <div className="max-w-4xl mx-auto">
                    <h2 className="sm:text-3xl text-2xl font-bold mb-3">
                        Our Vision
                    </h2>
                    <p className="sm:text-lg text-base leading-relaxed">
                        To be the world’s most trusted bridge between cultural
                        heritage and digital convenience—where every gift
                        carries both blessings and innovation.
                    </p>
                </div>
            </section>

            {/* OUR MISSION Section */}
            <section className="max-w-2xl mx-auto md:py-16 py-10 px-4 sm:px-10 flex justify-center">
                <div className="relative flex flex-col items-start lg:space-y-12 sm:space-y-8 space-y-6">
                    <h2 className="sm:text-3xl self-center text-2xl font-bold ">
                        Our Mission
                    </h2>

                    {missionPoints.map((point, idx) => (
                        <div key={idx} className="relative pl-10">
                            {/* Circle with number */}
                            <div
                                className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#ff7a2d] text-white font-semibold z-10 border-2 border-white shadow-md transition-all duration-500 ${
                                    idx < visibleIndex
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-50"
                                }`}
                            >
                                {idx + 1}
                            </div>

                            {/* Connecting dotted line */}
                            {idx < visibleIndex - 1 && (
                                <div className="absolute left-4 top-8 lg:h-16 sm:h-12 h-8 border-l-2 border-orange-300 border-dotted z-0"></div>
                            )}

                            {/* Description */}
                            <div
                                className={`transition-opacity duration-700 delay-150 ${
                                    idx < visibleIndex
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                <p className="text-gray-800 text-sm sm:text-base">
                                    {point}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
