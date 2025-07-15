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
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

const DashboardCards = () => {
    const [activeTab, setActiveTab] = useState("Events");

    const [analytics, setAnalytics] = useState({
        totalHosts: 0,
        totalEvents: 0,
        totalEnvelopes: 0,
        totalBudget: 0,
    });

    const tabs = [ "Events", "IoT Machines", "Payments", "Hosts", "Agents", "Analytics", ];

    useEffect(() => {
        const fetchAnalytics = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.warn("User not logged in");
                return;
            }

            const uid = user.uid;
            console.log("uid from admin:", uid);
        
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const userDocs = usersSnapshot.docs;
                console.log("userDocs:", usersSnapshot);

                let totalHosts = 0;
                let totalEvents = 0;
                let totalEnvelopes = 0;
                let totalBudget = 0;

                for (const userDoc of userDocs) {
                    const uid = userDoc.id;
                    console.log("userDoc ID:", uid);

                    // Check if personalDetails/info exists
                    const personalSnap = await getDoc(doc(db, `users/${uid}/personalDetails/info`));
                    if (personalSnap.exists()) {
                        totalHosts += 1;
                    }

                    // Check if eventDetails/info exists
                    const eventSnap = await getDoc(doc(db, `users/${uid}/eventDetails/info`));
                    if (eventSnap.exists()) {
                        totalEvents += 1;
                    }

                    // Check for envelopes (optional custom doc like envelopeRecharge_...)
                    const budgetSnap = await getDoc(doc(db, `users/${uid}/eventDetails/budget`));
                    if (budgetSnap.exists()) {
                        const budgetData = budgetSnap.data();
                        if (budgetData.members) {
                            totalEnvelopes += parseInt(budgetData.members);
                            totalBudget += parseFloat(budgetData.amount || 0);
                        }
                    }
                }

                setAnalytics({
                    totalHosts,
                    totalEvents,
                    totalEnvelopes,
                    totalBudget
                });
            } catch (error) {
                console.error("Error Fetching Analytics:", error);
            }
        });
    
        return () => fetchAnalytics(); // Clean up the listener on unmount
    }, []);

    return (
        <div className="p-4 sm:px-6 lg:px-20 bg-[#fef4ec] min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shagun Admin Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Manage your IoT vending operations
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
                            SMS Blast
                        </button>
                        <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700">
                            Notifications
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">
                            Total Hosts
                        </p>
                        <MdOutlinePeopleOutline className="text-xl text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">{analytics.totalHosts}</h2>
                    <p className="text-sm text-gray-500">
                        +180 from last month
                    </p>
                </div>

                <Link to="/active-events">
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500 cursor-pointer hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 font-semibold">
                                Active Events
                            </p>
                            <FaCalendarAlt className="text-xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-black">{analytics.totalEvents}</h2>
                        <p className="text-sm text-gray-500">
                            Live events running
                        </p>
                    </div>
                </Link>

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

                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">
                            Today's Revenue
                        </p>
                        <FaRupeeSign className="text-xl text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black"> ₹{analytics.totalBudget.toLocaleString()}</h2>
                    <p className="text-sm text-gray-500">+12% from yesterday</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-semibold">
                            Total Envelopes
                        </p>
                        <FiCreditCard className="text-xl text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">{analytics.totalEnvelopes}</h2>
                    <p className="text-sm text-gray-500">Dispensed today</p>
                </div>
            </div>

            {/* Fee Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                        Service Fee Structure
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                        5% + ₹2,000
                    </p>
                    <p className="text-gray-500 mt-1">
                        5% of budget amount + fixed service fee
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-2">
                        Today's Service Fees
                    </h3>
                    <p className="text-2xl font-bold text-indigo-600">
                        ₹18,750
                    </p>
                    <p className="text-gray-500 mt-1">
                        Total fees collected today
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 bg-blue-50 rounded-xl p-1 grid  md:grid-cols-6 gap-4 text-gray-600 font-medium">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full px-4 py-2 rounded-lg whitespace-nowrap transition ${
                            activeTab === tab
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
                {activeTab === "Payments" && <Payments />}
                {activeTab === "Hosts" && <Hosts />}
                {activeTab === "Agents" && <Agents />}
                {activeTab === "Analytics" && <Analytics />}
            </div>
        </div>
    );
};
export default DashboardCards;
