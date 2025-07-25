import { FaQrcode, FaLaptop, FaChartLine, FaFileAlt, FaEnvelopeOpenText, FaUserTie, FaHeadset, FaTools, } from "react-icons/fa";

const services = [
    {
        icon: <FaLaptop className="text-orange-600 text-2xl" />,
        title: "IoT-Enabled Kiosk Deployment",
        description:
            "End-to-end setup of Shagun’s contactless envelope vending machines at your event venues.",
    },
    {
        icon: <FaQrcode className="text-pink-500 text-2xl" />,
        title: "UPI QR Integration",
        description:
            "Seamlessly embed each host’s UPI QR code so guests can scan and pay in seconds.",
    },
    {
        icon: <FaChartLine className="text-yellow-500 text-2xl" />,
        title: "Real-Time Dashboard",
        description:
            "Live portal view of all transactions, envelope counts, prepaid balance and top-up controls.",
    },
    {
        icon: <FaFileAlt className="text-orange-300 text-2xl" />,
        title: "Automated Reconciliation",
        description:
            "Instant Excel/PDF reports matching every dispensed envelope to its UPI payment for easy settlement.",
    },
    {
        icon: <FaEnvelopeOpenText className="text-pink-400 text-2xl" />,
        title: "Custom Envelope Designs",
        description:
            "Premium, on-theme artwork and branding for envelopes to elevate your event’s look and feel.",
    },
    {
        icon: <FaChartLine className="text-yellow-600 text-2xl" />,
        title: "Advanced Analytics & Insights",
        description:
            "Detailed breakdowns by guest, amount, venue, and time—to help you plan and report confidently.",
    },
    {
        icon: <FaTools className="text-yellow-400 text-2xl" />,
        title: "On-Site Support & Training",
        description:
            "Dedicated Shagun agents to install, refill, and train hosts on smooth kiosk operations.",
    },
    {
        icon: <FaHeadset className="text-pink-400 text-2xl" />,
        title: "24/7 Customer Support",
        description:
            "Round-the-clock assistance via hotline, in-app chat, and email to solve any event hiccups.",
    },
];

export default function Services() {
    return (
        <section className="bg-[#fef3eb] py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="md:text-4xl text-3xl font-bold text-center text-[#f45b0b] mb-12">
                    Our Services
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white border border-orange-400 rounded-lg px-4 py-5 flex flex-col gap-y-2 hover:shadow-md transition-shadow"
                        >
                            <div className="text-2xl">{service.icon}</div>
                            <h3 className="font-bold text-gray-900 text-lg">
                                {service.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
