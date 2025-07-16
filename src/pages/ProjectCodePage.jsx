import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { db } from "../utils/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const ProjectCodePage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [projects, setProjects] = useState(null);
    // code host event venue eventDate startTime envelope distributed revenue remission

    useEffect(() => {
        const fetchProjectByCode = async () => {
            const usersRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersRef);

            let foundProject = null;

            for (const userDoc of usersSnapshot.docs) {
                const uid = userDoc.id;

                const eventRef = doc(db, `users/${uid}/eventDetails/info`);
                const eventSnap = await getDoc(eventRef);

                if (!eventSnap.exists()) continue;

                const eventData = eventSnap.data();

                // Match the project code from URL
                if (eventData.projectCode === code) {
                    // Fetch additional data
                    const personalSnap = await getDoc(doc(db, `users/${uid}/personalDetails/info`));
                    const budgetSnap = await getDoc(doc(db, `users/${uid}/eventDetails/budget`));

                    const personalData = personalSnap.exists() ? personalSnap.data() : {};
                    const budgetData = budgetSnap.exists() ? budgetSnap.data() : {};

                    foundProject = {
                        code: eventData.projectCode,
                        host: personalData.fullName || "Unknown",
                        event: personalData.eventType || "Unknown",
                        venue: eventData.venueName || "Unknown",
                        eventDate: eventData.eventDate || "",
                        startTime: eventData.startTime || "",
                        envelope: budgetData.members || 0,
                        distributed: budgetData.distributed || 0,
                        revenue: budgetData.amount || 0,
                        remission: budgetData.platformFee || 0,
                    };

                    break; // stop once found
                }
            }

            if (foundProject) {
                setProjects(foundProject); // set as array to reuse table UI
                console.log("Found project:", foundProject);
            } else {
                console.warn("No matching project code found.");
                setProjects([]);
            }
        };

        if (code) fetchProjectByCode();
    }, [code]);

    const transactions = [
        {
            id: "TXN001",
            upi: "user1@upi",
            mobile: "9876543210",
            amount: "₹100",
            date: "24 May 2024",
        },
        {
            id: "TXN002",
            upi: "user2@upi",
            mobile: "9123456789",
            amount: "₹200",
            date: "24 May 2024",
        },
        {
            id: "TXN003",
            upi: "user3@upi",
            mobile: "9083727655",
            amount: "₹500",
            date: "20 May 2024",
        },
    ];

    return (
        <div className="min-h-screen bg-[#fdf6ed] pb-6">
            {/* Navbar */}
            <nav className="bg-[#4a0f23] text-white flex justify-between items-center px-6 py-4 relative">
                <h1 className="text-xl font-bold ml-2">Admin Dashboard</h1>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 mr-2">
                    <div onClick={() => navigate("/admin")} className="hover:text-[#ccbf95] font-medium cursor-pointer">
                        Dashboard
                    </div>
                    <div className="hover:text-[#ccbf95] font-medium cursor-pointer">
                        Projects
                    </div>
                    <div className="hover:text-[#ccbf95] font-medium cursor-pointer">
                        Machines
                    </div>
                </ul>

                {/* Hamburger Icon */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-2xl focus:outline-none z-50 relative"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <ul className="absolute top-full left-0 right-0 text-center  bg-[#4a0f23] text-white py-4 px-6 z-40 flex flex-col gap-4 md:hidden shadow-lg">
                        <li className="hover:text-[#ccbf95] font-medium cursor-pointer">
                            Dashboard
                        </li>
                        <li className="hover:text-[#ccbf95] font-medium cursor-pointer">
                            Projects
                        </li>
                        <li className="hover:text-[#ccbf95] font-medium cursor-pointer">
                            Machines
                        </li>
                    </ul>
                )}
            </nav>

            <div className="px-10 lg:px-16">
                {/* Breadcrumb */}
                <div className="px-6 py-6 text-base text-[#8b5e3c] font-bold">
                    Projects /{" "}
                    <span className="text-black font-medium">{code}</span>
                </div>

                {/* Project Header */}
                <div className="mx-6 bg-white rounded p-4 shadow mb-6 text-sm">
                    <h2 className="text-xl font-bold mb-2">{code}</h2>
                    <hr className="border-t border-gray-200 my-2" />
                    <div className="grid grid-cols-3 gap-6 font-semibold text-gray-700 mb-1">
                        <p>Host</p>
                        <p>Event</p>
                        <p>Event Date / Time</p>
                    </div>
                    <hr className="border-t border-gray-200 my-2" />

                    {/* host,event,date/time */}
                    <div className="grid grid-cols-3 gap-6 text-gray-800">
                        <div>
                            <p>{projects?.host}</p>
                            <p>event</p>
                        </div>
                        <div>
                            <p>{projects?.event}</p>
                            <p>{projects?.venue}</p>
                        </div>
                        <div>
                            <p>{projects?.eventDate}</p>
                            <p>{projects?.startTime}</p>
                        </div>
                    </div>
                </div>

                {/* Stats + Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 px-4 sm:px-6 mb-6">
                    {/* Envelopes Dispensed */}
                    <div className="bg-[#e1c65b] text-black rounded-lg p-4 sm:p-2 flex flex-col justify-center items-center text-center h-auto">
                        <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                            {projects?.distributed ?? 0}/{projects?.envelope}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-800 mt-1">
                            Envelopes Dispensed
                        </p>
                    </div>

                    {/* Threshold Exceeded */}
                    <div className="bg-[#d93c3c] text-white rounded-lg p-4 sm:p-5 flex items-center justify-center text-center h-auto">
                        <h3 className="text-xl sm:text-2xl font-bold">
                            Threshold Exceeded
                        </h3>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-[#e1c65b] text-black rounded-lg p-4 sm:p-2 flex flex-col justify-center items-center text-center h-auto">
                        <p className="text-sm sm:text-base text-gray-800">
                            Total Revenue
                        </p>
                        <h3 className="text-xl sm:text-2xl font-bold leading-tight mt-1">
                            {projects?.revenue ?? 0}
                        </h3>
                    </div>

                    {/* Overview Section */}
                    <div className="col-span-1 lg:col-span-2 bg-white rounded-lg p-2 shadow min-h-[200px]">
                        <p className="text-md font-bold mb-4 text-lg ml-4">
                            Overview
                        </p>

                        <div className="flex flex-col md:flex-row justify-evenly items-center divide-y md:divide-y-0 md:divide-x divide-gray-300">
                            {/* Left & Right Columns */}
                            <div className="flex gap-12 px-6 py-4 md:py-0 md:px-6 w-full md:w-auto divide-x divide-gray-300">
                                <div className="flex flex-col gap-4 pr-6">
                                    <p className="flex flex-col text-gray-600 leading-tight">
                                        <span className="text-xl font-bold">
                                            6
                                        </span>
                                        Registrations
                                    </p>
                                    <p className="flex flex-col text-gray-600 leading-tight">
                                        <span className="invisible">.</span>
                                        UPI ID
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 pl-6">
                                    <p className="flex flex-col text-gray-600 leading-tight">
                                        <span className="invisible text-xl">
                                            .
                                        </span>
                                        Vednaten
                                    </p>
                                    <p className="flex flex-col text-gray-600 leading-tight">
                                        <span className="invisible">.</span>
                                        ample.upi
                                    </p>
                                </div>
                            </div>

                            {/* Operation Info */}
                            <div className="flex flex-col gap-2 items-start px-6 py-4 md:py-0 w-auto">
                                <button className="bg-green-800 px-4 py-2 rounded-lg text-white w-full">
                                    Operational
                                </button>
                                <p className="text-sm text-gray-700">
                                    Purchased Feb 2024
                                </p>
                                <p className="text-sm text-gray-700">
                                    Supplier: ABC Vending
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Remission + Refund */}
                    <div className="flex flex-col gap-4 h-full">
                        <div className="bg-[#e1c65b] text-black rounded p-4 text-sm flex justify-between flex-1">
                            <div>
                                <p className="font-medium text-gray-800">
                                    Remission
                                </p>
                                <h3 className="text-2xl font-bold">₹{projects?.remission ?? 0}</h3>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    Refund
                                </p>
                                <h3 className="text-2xl font-bold">₹0</h3>
                            </div>
                        </div>
                        
                        {/* Refund */}
                        <div className="bg-white rounded p-4 text-sm flex justify-between flex-1">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Refund
                                </p>
                                <p className="text-2xl font-bold text-black">
                                    ₹0
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mt-1">
                                    1–3 days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-bold">Transactions</h3>
                        <span className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer">
                            Details <IoIosArrowDown className="text-lg pt-1" />
                        </span>
                    </div>

                    {/* Table Wrapper */}
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-[600px] w-full text-sm text-left border border-gray-300">
                            <thead>
                                <tr className="bg-[#fcf4ea] text-gray-600  text-xs">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">UPI ID</th>
                                    <th className="p-2">Mobile Number</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Date/Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn, i) => (
                                    <tr key={i} className="border-t bg-gray-50">
                                        <td className="p-2">{txn.id}</td>
                                        <td className="p-2">{txn.upi}</td>
                                        <td className="p-2">{txn.mobile}</td>
                                        <td className="p-2">{txn.amount}</td>
                                        <td className="p-2">{txn.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCodePage;
