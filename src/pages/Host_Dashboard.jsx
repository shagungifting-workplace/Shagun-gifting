import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Host_Dashboard = () => {
    const [showAll, setShowAll] = useState(false);
    const [hostInfo, setHostInfo] = useState({});
    const [eventInfo, setEventInfo] = useState({});
    const [budgetInfo, setBudgetInfo] = useState({});
    const [projectCode, setProjectCode] = useState("");
    const [transactions, setTransactions] = useState([]);
    console.log("set", setTransactions) // Placeholder if you integrate later

    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalTransactions = transactions.length;
    const displayedTxns = showAll ? transactions : transactions.slice(0, 3);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;

                try {
                    // Fetch Host Name
                    const personalRef = doc(db, `users/${uid}/personalDetails/info`);
                    const personalSnap = await getDoc(personalRef);
                    if (personalSnap.exists()) {
                        setHostInfo(personalSnap.data());
                    } else {
                        alert("personalDetails not fetched ")
                    }

                    // Fetch Event Info (project code, venue, etc.)
                    const eventRef = doc(db, `users/${uid}/eventDetails/info`);
                    const eventSnap = await getDoc(eventRef);
                    if (eventSnap.exists()) {
                        const data = eventSnap.data();
                        setEventInfo(data);
                        if (data.projectCode) setProjectCode(data.projectCode);
                    } else {
                        alert("eventDetails not fetched ")
                    }

                    // Fetch Budget Info
                    const budgetRef = doc(db, `users/${uid}/eventDetails/budget`);
                    const budgetSnap = await getDoc(budgetRef);
                    if (budgetSnap.exists()) {
                        setBudgetInfo(budgetSnap.data());
                    } else {
                        alert("Budget not fetched")
                    }

                    // Fetch transactions here later if needed

                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                }
            } else {
                console.warn("User not logged in");
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    return (
        <div className="p-4 bg-[#f2f2f2] font-['Segoe UI',sans-serif]">
            {/* 🔙 Top Navigation Bar */}
            <div className="flex flex-wrap justify-between items-center mb-4">
                <Link to="/">
                    <button className="flex items-center gap-2 text-[#2a2a2a] font-semibold text-base">
                        <IoIosArrowBack size={20} /> Host Dashboard
                    </button>
                </Link>
                <span className="text-sm font-medium text-gray-600">{projectCode || "768039-20250714-2018-11"}</span>
            </div>

            {/* 📝 Card Content */}
            <div className="bg-[#FFF4E5] rounded-lg p-4 shadow-md">
                {/* 🎯 Host Info and Project Code */}
                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-[#1e1e2f]">{hostInfo.fullName || "Loading..."}</h2>
                        <p>
                            Event: {eventInfo?.eventType} | Side: {eventInfo?.side} |{" "}
                            {eventInfo?.side === "Bride" ? `Heroine: ${eventInfo?.heroineName}` : `Hero: ${eventInfo?.heroName}`}
                        </p>
                        <p>Venue: {eventInfo?.venueName}</p>
                        <p>
                            Date: {eventInfo?.eventDate} | Time: {eventInfo?.startTime} | Event No: {eventInfo?.eventNumber}
                        </p>

                        {/* 📦 Status Boxes */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex-1 text-center bg-[#fff8b0] text-[#665c00] font-bold p-4 rounded-md">
                                0/{budgetInfo?.members || "?"}
                                <br /> Envelopes
                            </div>
                            <div className="flex-1 text-center bg-[#ffe0e0] text-[#a10000] font-bold p-4 rounded-md">
                                Threshold
                                <br /> Not Reached
                            </div>
                            <div className="flex-1 text-center bg-[#e0ffe5] text-[#087f23] font-bold p-4 rounded-md">
                                ₹{totalAmount}
                                <br /> Revenue
                            </div>
                        </div>
                    </div>

                    {/* 🆔 Project code */}
                    <div className="bg-[#ffe6ea] p-4 rounded-lg w-full max-w-sm">
                        <p className="text-sm text-[#a10000] mb-2">User ID: {auth.currentUser?.uid}</p>
                        <h4 className="text-lg font-semibold mb-2">📌 Project Code</h4>
                        <div className="bg-[#f1f1f1] p-2 text-center font-bold rounded mb-2">
                            {projectCode || "768039-20250714-2018-11"}
                        </div>
                        <p className="text-xs text-[#333]">PIN + Date + Time + Event No.</p>
                    </div>
                </div>

                {/* 🧾 Info Boxes */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#e6f0ff] text-[#003366] shadow-sm">
                        <h4 className="font-semibold mb-1">Overview</h4>
                        <p>Guests: {budgetInfo?.members || "--"}</p>
                        <p>Budget: ₹{budgetInfo?.amount?.toLocaleString() || "--"}</p>
                    </div>

                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#f3e6ff] text-[#4b0082] shadow-sm">
                        <h4 className="font-semibold mb-1">Financial Overview</h4>
                        <p>UPI Collected: ₹{totalAmount}</p>
                        <p>Utilized Budget: ₹{totalAmount}</p>
                        <p>Platform Fee: ₹{budgetInfo.platformFee?.toFixed(1) || "0"}</p>
                        <p>Recharge Payments: ₹0</p>
                    </div>

                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#ffddc3] text-[#994d00] shadow-sm">
                        <h4 className="font-semibold mb-1">UPI Details (Gifts)</h4>
                        <div className="bg-[#ccc] text-center p-6 rounded-md my-2">QR CODE HERE</div>
                        <p>UPI ID: {budgetInfo?.upiId || "N/A"}</p>
                        <p>
                            A/C: {budgetInfo?.accountNumber || "—"} | IFSC: {budgetInfo.ifsc || "—"}
                        </p>
                    </div>

                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#ffe6f0] text-[#cc0066] shadow-sm">
                        <h4 className="font-semibold mb-1">Envelope Usage</h4>
                        <p>Used: 0 / {budgetInfo?.members}</p>
                        <input
                            type="text"
                            placeholder="Add envelopes"
                            className="mt-2 p-2 w-full rounded border border-gray-300"
                        />
                        <button className="mt-3 w-3/4 bg-[#cc0066] text-white py-2 rounded-md">
                            Recharge Budget (5% fee)
                        </button>
                    </div>
                </div>

                {/* 💳 Transactions Section — You can integrate Firestore payments collection later */}
                <div className="mt-8">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">Guests Who Paid</h4>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="bg-gray-300 border border-gray-500 px-3 py-1 rounded text-sm font-medium flex items-center gap-1"
                            >
                                {showAll ? <>Hide Details <IoIosArrowUp /></> : <>Details <IoIosArrowDown /></>}
                            </button>
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                                <FiDownload /> Download
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className={showAll ? 'min-w-[700px]' : ''}>
                            <table className="w-full bg-white border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left">Sr.</th>
                                        <th className="p-2 text-left">Guest UPI ID</th>
                                        <th className="p-2 text-left">Guest Mobile</th>
                                        <th className="p-2 text-left">Amount</th>
                                        <th className="p-2 text-left">Txn ID</th>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Time</th>
                                        <th className="p-2 text-left">Payment Mode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedTxns.map((txn, index) => (
                                        <tr key={txn.id} className="border-b">
                                            <td className="p-2">{index + 1}</td>
                                            <td className="p-2">{txn.upi}</td>
                                            <td className="p-2">{txn.mobile}</td>
                                            <td className="p-2">₹{txn.amount}</td>
                                            <td className="p-2">{txn.id}</td>
                                            <td className="p-2">{txn.date}</td>
                                            <td className="p-2">{txn.time}</td>
                                            <td className="p-2">{txn.mode}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-[#f5f5f5] font-bold">
                                        <td className="p-2" colSpan="3">Total Amount</td>
                                        <td className="p-2" colSpan="5">₹{totalAmount.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-[#f5f5f5] font-bold">
                                        <td className="p-2" colSpan="3">Total Transactions</td>
                                        <td className="p-2" colSpan="5">{totalTransactions}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Host_Dashboard;
