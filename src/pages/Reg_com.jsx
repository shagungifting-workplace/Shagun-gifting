import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaCheckCircle, FaGift } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Reg_com() {
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [projectCode, setProjectCode] = useState("");

    useEffect(() => {
        const fetchDataAndGenerateCode = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.warn("User not logged in");
                    return;
                }

                // Fetch payment
                const paymentRef = doc(db, `users/${user.uid}/eventDetails/payment`);
                const paymentSnap = await getDoc(paymentRef);

                if (paymentSnap.exists()) {
                    setPaymentInfo(paymentSnap.data());
                } else {
                    console.warn("No payment document found.");
                }

                // Fetch event info
                const eventRef = doc(db, `users/${user.uid}/eventDetails/info`);
                const eventSnap = await getDoc(eventRef);

                if (eventSnap.exists()) {
                    const eventData = eventSnap.data();

                    // ✅ Generate project code
                    if (eventData?.pin && eventData?.eventDate && eventData?.startTime && eventData?.eventNumber) {
                        const formattedDate = eventData.eventDate.replace(/-/g, "");
                        const formattedTime = eventData.startTime.replace(/:/g, "");
                        const generatedCode = `${eventData.pin}-${formattedDate}-${formattedTime}-${eventData.eventNumber}`;
                        setProjectCode(generatedCode);

                        // ✅ Save to Firestore
                        await setDoc(eventRef, { projectCode: generatedCode }, { merge: true });
                        console.log("✅ Project code saved to Firestore.");
                    }
                } else {
                    console.warn("No event info found.");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDataAndGenerateCode();
    }, []);

    return (
        <div>
            {/* ✅ Navbar */}
            <div className="flex justify-between items-center px-9 py-7 bg-white border-b border-gray-200 gap-3 overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
                    <Link to="/">
                        <FaArrowLeft className="text-[16px] text-[#333] cursor-pointer shrink-0" />
                    </Link>
                    <FaGift className="text-[20px] text-orange-600 flex-shrink-0" />
                    <span className="font-semibold text-lg text-orange-600">
                        Shagun
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center">
                        1
                    </div>
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center">
                        2
                    </div>
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center">
                        3
                    </div>
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center">
                        4
                    </div>
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center">
                        <FaCheck />
                    </span>
                </div>
            </div>

            {/* ✅ Registration Card Section */}
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fef6f0] via-[#fdf0e6] to-[#fefde8] px-4">
                <div className="bg-white rounded-xl shadow-md px-8 py-10 text-center max-w-md w-full">
                    <FaCheckCircle className="text-green-600 text-5xl mb-4 mx-auto" />
                    <h2 className="text-2xl font-semibold text-green-800 mb-6">
                        Registration Complete!
                    </h2>

                    {/* project code */}
                    <div className="bg-[#f6f9fb] rounded-lg p-4 mb-6">
                        <p className="text-gray-600 text-base mb-1">
                            Your Project Code:
                        </p>
                        <p className="text-orange-500 text-lg font-bold tracking-wider">
                            {projectCode || "Loading..."}
                        </p>
                    </div>

                    {/* details */}
                    <ul className="text-gray-800 text-base list-none space-y-2 mb-6 leading-relaxed">
                        <li>✓ Registration fee: {paymentInfo?.amount || "Loading..."}</li>
                        <li>✓ IoT machine will be deployed</li>
                        <li>✓ SMS notifications enabled</li>
                    </ul>

                    {/* ✅ Buttons vertically stacked */}
                    <div className="flex flex-col gap-3">
                        <Link to="/">
                            <button
                                className="w-full bg-gradient-to-r from-[#ff7a18] to-[#ff4e50] hover:from-[#e44d26] hover:to-[#c0392b] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                                onClick={() => navigate("/")}
                            >
                                Home
                            </button>
                        </Link>

                        <Link to="/host_dash">
                            <button
                                className="w-full bg-gradient-to-r from-[#ff7a18] to-[#ff4e50] hover:from-[#e44d26] hover:to-[#c0392b] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                                onClick={() => navigate("/")}
                            >
                                Host Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
