import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import AgentProfile from "../../pages/AgentProfile"; 
import { useLoadingStore } from "../../store/useLoadingStore";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

const Agents = () => {

    const [agents, setAgents] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const toggleAlert = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const setLoading = useLoadingStore((state) => state.setLoading);

    useEffect(() => {
        const loadAgents = async () => {
            const user = auth.currentUser;
            if (!user) return;

            setLoading(true);
            try {
                const agentCollectionRef = collection(db, `admin/${user.uid}/agentDetails`);
                const snapshot = await getDocs(agentCollectionRef);

                const agents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAgents(agents);
                console.log("Agents fetched successfully!");
            } catch (error) {
                console.error("Error fetching agents:", error);
                return [];
            } finally {
                setLoading(false);
            }
        }

        loadAgents();
    }, [setLoading]);

    const [showDrawer, setShowDrawer] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleSendEmail = (recipientEmail, message) => {
        if (!recipientEmail) {
            alert("Email is missing for this agent!");
            return;
        }

        const subject = encodeURIComponent("Important Alert from Shagun Admin");
        const body = encodeURIComponent(message || "Please review this alert.");

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
    };

    return (
        <div className="mt-10 bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-6">
            {showDrawer && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-40" onClick={() => setShowDrawer(false)}></div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center gap-2">
                <div className="flex items-center text-lg sm:text-xl font-semibold gap-2 text-gray-800">
                    <FaMapMarkerAlt className="text-gray-800" />
                    <span>Agent Management (PIN Code Wise)</span>
                </div>
                <button
                    onClick={() => setShowDrawer(true)}
                    className="text-sm sm:text-lg px-3 bg-white hover:bg-[#fef3eb] py-1 border-2 rounded-lg flex items-center gap-2 font-semibold"
                >
                    Add agents
                </button>
            </div>
            
            {/* Bottom Drawer */}
            <div
                className={`fixed w-full left-0 bottom-0 z-50 overflow-y-auto bg-white rounded-t-2xl shadow-2xl 
                    transition-transform duration-500 ${showDrawer ? "translate-y-0" : "translate-y-full" }`}
                style={{ height: "80vh" }}
            >
                <AgentProfile setShowDrawer={setShowDrawer} /> 
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {agents.map((agent, index) => (
                <div
                    key={index}
                    className="border p-4 rounded-xl shadow-sm flex flex-col justify-between relative"
                >
                    {/* Alert Box - appears ABOVE */}
                    {openIndex === index && (
                        <div className="absolute bottom-0 mb-2 w-80 xl:w-96 max-h-72 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-slideUp">
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">Alert Message</h3>
                                    <button
                                        onClick={() => setOpenIndex(null)}
                                        className="text-gray-400 font-bold hover:text-red-500 text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    rows="4"
                                    placeholder="Type your message here..."
                                    value={alertMessage}
                                    onChange={(e) => setAlertMessage(e.target.value)}
                                ></textarea>
                                <button onClick={() => {handleSendEmail(agent?.email, alertMessage), setOpenIndex(null)}} className="bg-white text-black font-semibold py-2 px-4 rounded-md hover:bg-[#fef3eb] mt-2 border border-gray-300 text-sm">
                                    Send Alert
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Agent Info */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                            {agent?.fullName}
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base mb-2">
                            {agent?.status}
                        </p>

                        <div className="text-sm text-gray-700 space-y-2 mt-3">
                            <p className="flex justify-between">
                                <span className="font-semibold">PIN Code:</span>
                                <span>{agent?.pin}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold">Mobile:</span>
                                <span>{agent?.mobile}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-semibold">Active Machines:</span>
                                <span>{agent?.vendingMachine}</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-4">
                        <button className="flex-1 sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium">
                            <FiMessageSquare /> SMS
                        </button>
                        <button
                            onClick={() => toggleAlert(index)}
                            className="flex-1 sm:w-auto px-4 py-2 rounded border border-gray-300 text-sm font-medium"
                        >
                            Alert
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default Agents;
