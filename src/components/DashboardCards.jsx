import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaRupeeSign } from "react-icons/fa";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { FiCreditCard } from "react-icons/fi";
import { FiCpu } from "react-icons/fi";
import Events from "./dashboardtabs/Events";
import IoTMachines from "./dashboardtabs/IoTMachines";
import Payments from "./dashboardtabs/Payments";
import Hosts from "./dashboardtabs/Hosts";
import Agents from "./dashboardtabs/Agents";
import Analytics from "./dashboardtabs/Analytics";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { useLoadingStore } from "../store/useLoadingStore";
import { fetchAllProjects } from "../utils/FetchProject";

const DashboardCards = () => {
    const [activeTab, setActiveTab] = useState("Events");
    const setLoading = useLoadingStore((state) => state.setLoading);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [todaysRevenue, setTodaysRevenue] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [fixedTotalFees, setFixedTotalFees] = useState(0);
    const [serviceTotalFees, setServiceTotalFees] = useState(0);
    const [todaysFixedFees, setTodaysFixedFees] = useState(0);
    const [todaysServiceFees, setTodaysServiceFees] = useState(0);
    const [activeEvents, setActiveEvents] = useState(0);

    function parseCustomDate(dateStr) {
        const [datePart, timePart] = dateStr.split(", ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    useEffect(() => {
        const getProjectByCode = async () => {
            setLoading(true);
            try {
                const allProjects = await fetchAllProjects();
                setProjects(allProjects);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let totalRevenue = 0;
                let todaysRevenue = 0;

                let totalFixedFees = 0;
                let totalServiceFees = 0;
                let todaysFixedFees = 0;
                let todaysServiceFees = 0;

                let activeEventsCount = 0;

                allProjects.forEach((project) => {
                    let createdAt;
                    if(project?.status === "Running") {
                        activeEventsCount++;
                    }

                    if (project?.submittedAt?.toDate) {
                        createdAt = project.submittedAt.toDate();
                    } else if (typeof project?.submittedAt === "string") {
                        createdAt = parseCustomDate(project.submittedAt);
                    }

                    const isToday = createdAt && createdAt >= today;

                    if (project?.totalFee) {
                        totalRevenue += project?.fixedFee + project?.platformFee;
                        if (isToday) {
                            todaysRevenue += project?.totalFee;
                        }
                    }

                    // ✅ Add fixed & service fees
                    if (project?.fixedFee) {
                        totalFixedFees += project.fixedFee;
                        if (isToday) {
                            todaysFixedFees += project.fixedFee;
                        }
                    }

                    if (project?.platformFee) {
                        totalServiceFees += project.platformFee;
                        if (isToday) {
                            todaysServiceFees += project.platformFee;
                        }
                    }

                    // ✅ Include today's envelope recharges (service fee part)
                    if (project?.recharges?.length) {
                        project.recharges.forEach((r) => {
                            // handle both Firestore Timestamp and string
                            let paidDate;
                            if (r?.paidAt?.toDate) {
                                paidDate = r.paidAt.toDate();
                            } else if (typeof r?.paidAt === "string") {
                                paidDate = parseCustomDate(r.paidAt);
                            }

                            if (paidDate && paidDate >= today) {
                                // ✅ calculate platform fee from recharge
                                const rechargePlatformFee = (r?.RechargePaid || 0);
                                todaysServiceFees += rechargePlatformFee;
                            }
                        });
                    }
                });

                // Update state
                setTotalRevenue(totalRevenue);
                setTodaysRevenue(todaysRevenue);

                setFixedTotalFees(totalFixedFees);
                setServiceTotalFees(totalServiceFees);

                setTodaysFixedFees(todaysFixedFees);
                setTodaysServiceFees(todaysServiceFees);

                setActiveEvents(activeEventsCount);

            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjectByCode();
    }, [setLoading]);

    useEffect(() => {
        const adminUid = import.meta.env.VITE_ADMIN_UID;
        const unsub = onSnapshot(
            collection(db, `admin/${adminUid}/notifications`),
            (snapshot) => {
                const items = snapshot.docs.map(doc => ({ userId: doc.userId, ...doc.data() }));
                setNotifications(items);
            }
        );
        return () => unsub();
    }, []);

    const tabs = ["Events", "IoT Machines", "Payments", "Hosts", "Agents", "Analytics",];

    useEffect(() => {
        const fetchAnalytics = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.warn("User not logged in");
                navigate("/adminAuth");
                return;
            }
        });

        return () => fetchAnalytics(); // Clean up the listener on unmount
    }, [setLoading, navigate]);

    const handleExport = async () => {
        try {
            const response = await fetch("https://us-central1-gifting-99729.cloudfunctions.net/exportFirestoreToExcel");
            if (!response.ok) throw new Error("Network error");

            // Convert response → Blob (Excel file)
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create download link
            const a = document.createElement("a");
            a.href = url;
            a.download = "firestore_export.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();

        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed, check console");
        }
    };

    return (
        <div className="p-4 sm:px-6 lg:px-20 bg-[#fef4ec] min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shagun Admin Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Manage your IoT vending operations
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button onClick={handleExport} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500">
                            Download user details
                        </button>
                        <button onClick={() => navigate("changepassword")} className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700">
                            Change Password
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700">
                            Notifications
                        </button>

                        {/* Notification Box */}
                        {isOpen && (
                            <div className="absolute right-2 mt-2 w-80 max-h-72 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-slideUp">
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-400 font-bold hover:text-red-500 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {notifications.length === 0 ? (
                                        <p className="text-sm text-gray-500">No new notifications</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {notifications.slice().reverse().map((notif, index) => (
                                                <li key={index} className="p-2 bg-[#fef4ec] rounded-md border border-gray-200">
                                                    <p className="text-sm text-gray-700">
                                                        {notif.fullName} is Registered with email: {notif.email}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {notif.createdAt
                                                            ? new Date(notif.createdAt.seconds * 1000).toLocaleString()
                                                            : 'Just now'}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                {/* Total Hosts */}
                <div onClick={() => navigate("/total-hosts")} className="cursor-pointer">
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 font-semibold">
                                Total Hosts
                            </p>
                            <MdOutlinePeopleOutline className="text-xl text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-black">{projects?.length}</h2>
                        <p className="text-sm text-gray-500">
                            +180 from last month
                        </p>
                    </div>
                </div>

                {/* Active Events */}
                <div onClick={() => navigate("/active-events")}>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500 cursor-pointer hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 font-semibold">
                                Active Events
                            </p>
                            <FaCalendarAlt className="text-xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-black">{activeEvents}</h2>
                        <p className="text-sm text-gray-500">
                            Live events running
                        </p>
                    </div>
                </div>

                {/* Machines Online */}
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">
                            Machines Online
                        </p>
                        <FiCpu className="text-xl text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">42/45</h2>
                    <p className="text-sm text-gray-500">93.3% uptime</p>
                </div>

                {/* Today's Revenue */}
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">
                            Today's Revenue
                        </p>
                        <FaRupeeSign className="text-xl text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black"> ₹{todaysRevenue.toLocaleString()}</h2>
                    <p className="text-sm text-gray-500">+12% from yesterday</p>
                </div>

                {/* Total Envelopes */}
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">
                            Total Envelopes
                        </p>
                        <FiCreditCard className="text-xl text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">{projects[0]?.members}</h2>
                    <p className="text-sm text-gray-500">Dispensed today</p>
                </div>
            </div>

            {/* Fee Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                {/* Service Fee Structure */}
                <div className="bg-white rounded-lg lg:p-6 p-4 space-y-2 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">Service Fee Structure</p>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-500">5% + ₹2,000</h2>
                    <p className="text-sm text-gray-500">5% of budget amount + fixed fee</p>
                </div>

                {/* Today's Service Fees */}
                <div className="bg-white rounded-lg lg:p-6 p-4 space-y-2 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">Today's Service Fees</p>
                    </div>
                    <h2 className="text-2xl font-bold text-green-500">₹{todaysServiceFees.toLocaleString()}</h2>
                    <p className="text-sm text-gray-500">Total fees collected today</p>
                </div>

                {/* Total Fixed Fees */}
                <div className="bg-white rounded-lg lg:p-6 p-4 space-y-2 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">Total Fixed Fees</p>
                    </div>
                    <h2 className="text-2xl font-bold text-orange-500">₹{fixedTotalFees.toLocaleString()}</h2>
                    <p className="text-sm text-gray-500">Total fixed fees collected</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-lg lg:p-6 p-4 space-y-2 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">Total Revenue</p>
                    </div>
                    <h2 className="text-2xl font-bold text-purple-500">₹{totalRevenue.toLocaleString()}</h2>
                    <p className="text-sm text-gray-500">Upto today all types of income</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 bg-blue-50 rounded-xl p-1 grid  md:grid-cols-6 gap-4 text-gray-600 font-medium">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full px-4 py-2 rounded-lg whitespace-nowrap transition ${activeTab === tab
                            ? "bg-white text-black shadow"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Dynamic Tab Content */}
            <div className="mt-6">
                {activeTab === "Events" && <Events />}
                {activeTab === "IoT Machines" && <IoTMachines />}
                {activeTab === "Payments" && <Payments totalRevenue={totalRevenue} />}
                {activeTab === "Hosts" && <Hosts />}
                {activeTab === "Agents" && <Agents />}
                {activeTab === "Analytics" && <Analytics />}
            </div>
        </div>
    );
};
export default DashboardCards;




