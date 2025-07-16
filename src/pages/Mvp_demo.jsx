import React, { useState, useEffect } from 'react';
import { auth, db } from "../utils/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDocs } from "firebase/firestore";
import toast from 'react-hot-toast';

const Mvp_demo = () => {
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [envelopesUsed, setEnvelopesUsed] = useState(0);
    const [notification, setNotification] = useState(null);
    const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const showNotification = (envelope, amt) => {
        setNotification(`Envelope #${envelope} dispensed! ₹${amt} received`);
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    const handlePay = async () => {
        if (!amount || parseInt(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const amt = parseInt(amount);
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not logged in");
            return;
        }

        const options = {
            key: razorpay_key, 
            amount: amt * 100,
            currency: "INR",
            name: "Shagun Guest Payment",
            description: "Envelope Payment",
            handler: async function (response) {
                try {
                    const newTransaction = {
                        guest: `Guest ${transactions.length + 1}`,
                        envelope: `${transactions.length + 1}`,
                        amount: amt,
                        time: new Date().toLocaleTimeString(),
                        razorpay_payment_id: response.razorpay_payment_id,
                        timestamp: serverTimestamp(),
                    };

                    // Store transaction in guest subcollection
                    const guestData = {
                        guestId: `Guest ${transactions.length + 1}`,
                        name: `Guest ${transactions.length + 1}`, 
                        envelope: `${transactions.length + 1}`,
                        amount: parseInt(amount),     
                        payment_id: response.razorpay_payment_id,           
                        time: new Date().toLocaleTimeString(),
                        timestamp: serverTimestamp()
                    };
                    await addDoc( collection(db, `users/${user.uid}/eventDetails/info/guests`), guestData);

                    // Update distributed and guestRevenue in info
                    const infoRef = doc(db, `users/${user.uid}/eventDetails/info`);
                    await setDoc(infoRef, {
                        distributed: envelopesUsed + 1,
                        guestRevenue: totalAmount + amt
                    }, { merge: true });

                    setTransactions([newTransaction, ...transactions]);
                    setTotalAmount(prev => prev + amt);
                    setEnvelopesUsed(prev => prev + 1);
                    showNotification(`${transactions.length + 1}`, amt);
                    setAmount('');
                    toast.success("Payment Successful!");
                } catch (error) {
                    console.error("Payment success handler error:", error);
                    toast.error("Something went wrong saving transaction.");
                }
            },
            prefill: {
                name: "Guest",
            },
            theme: {
                color: "#f45b0b"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    useEffect(() => {
        const fetchGuestTransactions = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const guestsRef = collection(db, `users/${user.uid}/eventDetails/info/guests`);
                const snapshot = await getDocs(guestsRef);
                const guestTransactions = [];

                let total = 0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    guestTransactions.push({
                        guest: data.name || "Guest",
                        envelope: data.envelope || "—",
                        amount: data.amount || 0,
                        time: data.time || "",
                    });
                    total += data.amount || 0;
                });

                setTransactions(guestTransactions.reverse()); // Most recent on top
                setTotalAmount(total);
                setEnvelopesUsed(guestTransactions.length);
            } catch (err) {
                console.error("Error fetching guest transactions:", err);
            }
        };

        fetchGuestTransactions();
    }, []);

    const avgAmount = transactions.length > 0 ? Math.floor(totalAmount / transactions.length) : 0;

    return (
        <div className="font-sans p-8 bg-[#fff6f1] min-h-screen" id="mvp-demo">
            <h1 className="text-3xl font-bold text-center text-[#111]">Shagun MVP Demo & Testing</h1>
            <p className="text-center text-[#444] mb-6">Test your IoT vending concept without real machines</p>

            <div className="flex justify-center gap-4 flex-wrap mb-6">
                <span className="bg-[#e0ffe0] text-green-700 px-3 py-1 rounded-md font-semibold text-sm">🟢 Live Demo</span>
                <span className="bg-[#eaf0ff] text-blue-600 px-3 py-1 rounded-md font-semibold text-sm">
                    Project: DEMO40000125062512000001
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-[#444]">Envelopes Used</p>
                        <h3 className="text-xl font-semibold text-[#0066ff]">{envelopesUsed}/100</h3>
                    </div>
                    <span>🎁</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-[#444]">Total Amount</p>
                        <h3 className="text-xl font-semibold text-[#009e4d]">₹{totalAmount.toLocaleString()}</h3>
                    </div>
                    <span>₹</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-[#444]">Machine Battery</p>
                        <h3 className="text-xl font-semibold text-[#ff6600]">85%</h3>
                    </div>
                    <span>📱</span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                    <div>
                        <p className="text-sm text-[#444]">Avg. Amount</p>
                        <h3 className="text-xl font-semibold text-purple-600">₹{avgAmount.toLocaleString()}</h3>
                    </div>
                    <span>📈</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
                {/* Simulator */}
                <div className="flex-1 min-w-[300px] max-w-md bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📱 Guest Transaction Simulator</h2>
                    <p className="text-sm mb-1 font-medium">Simulate Guest Payment</p>
                    <p className="text-xs text-[#333] mb-3">
                        Enter amount to simulate a guest scanning QR and making payment
                    </p>

                    <div className="mb-3">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={handleInputChange}
                            placeholder="Enter Amount"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 text-sm"
                        />
                        <button
                            onClick={handlePay}
                            className="w-full py-2 rounded-md text-white font-semibold bg-[#0aaf60] hover:bg-green-700"
                        >
                            Pay & Get Envelope
                        </button>
                    </div>

                    <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded-md text-sm">
                        <b>⚠️ MVP Testing Tips</b>
                        <p>
                            Use different amounts (₹101, ₹501, ₹1001) to test various scenarios.
                            Share this demo with potential hosts for feedback.
                        </p>
                    </div>
                </div>

                {/* Transactions */}
                <div className="flex-1 min-w-[300px] max-w-md bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">👥 Live Transactions</h2>
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        {transactions.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm">
                                🎁 No transactions yet<br />Start simulating guest payments
                            </p>
                        ) : (
                            transactions.map((t, i) => (
                                <div key={i} className="flex justify-between items-center bg-[#f8f8f8] p-3 mb-2 rounded-md">
                                    <div className="text-sm">
                                        <b>{t.guest}</b>
                                        <p>Envelope #{t.envelope}</p>
                                    </div>
                                    <div className="font-bold text-green-600 text-sm">₹{t.amount.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500 text-right">{t.time}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {notification && (
                <div className="fixed bottom-5 right-5 bg-gray-100 border-l-4 border-green-500 px-5 py-3 rounded-lg shadow-lg z-50 text-sm">
                    ✅ {notification}
                </div>
            )}
        </div>
    );
};

export default Mvp_demo;
