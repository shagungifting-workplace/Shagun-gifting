import React, { useState, useEffect } from "react";
import { FaInfoCircle, FaCreditCard, FaArrowLeft, FaGift, FaCheck, } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../utils/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Budget_bank() {
    const [formData, setFormData] = useState({
        members: "",
        amount: "",
        accountNumber: "",
        holderName: "",
        bankName: "",
        branchName: "",
        ifsc: "",
        accepted: false,
    });

    const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    const [platformFee, setPlatformFee] = useState(0);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [totalFee, setTotalFee] = useState(0);
    const fixedFee = 2000;
    const navigate = useNavigate();

    useEffect(() => {
        const budget = parseFloat(formData.amount || 0);
        const pf = budget * 0.05;
        setPlatformFee(pf);
        setTotalFee(pf + fixedFee);
    }, [formData.amount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.accepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                alert("User not logged in");
                return;
            }

            const dataToSave = {
                ...formData,
                members: parseInt(formData.members || 0),
                amount: parseFloat(formData.amount || 0),
                platformFee: parseFloat(platformFee.toFixed(1)),
                fixedFee,
                totalFee: parseFloat(totalFee.toFixed(1)),
                submittedAt: serverTimestamp(),
                isComplete: true,
            };

            await setDoc(
                doc(db, `users/${user.uid}/eventDetails/budget`),
                dataToSave
            );

            alert("Budget & Bank details saved successfully!");
            navigate("/reg_com");
        } catch (error) {
            console.error("Error saving budget/bank details:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleRazorpayPayment = () => {
        const user = auth.currentUser;
        if (!user) {
            alert("User not logged in");
            return;
        }

        const options = {
            key: razorpay_key, // 🔁 Replace with your Razorpay key
            amount: totalFee * 100, // Razorpay takes amount in paise
            currency: "INR",
            name: "Shagun - Event Payment",
            description: "Platform & Service Fee",
            handler: async function (response) {
                console.log("Payment success:", response);
                alert("Payment Successful!");
                setPaymentSuccess(true);

                // store payment details in Firestore
                try {
                    await setDoc(doc(db, `users/${user.uid}/eventDetails/payment`), {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id || null,
                        razorpay_signature: response.razorpay_signature || null,
                        paidAt: serverTimestamp(),
                        amount: parseFloat(totalFee.toFixed(1))
                    });

                    console.log("Razorpay payment details stored in Firestore.");
                } catch (err) {
                    console.error("Failed to store Razorpay details:", err);
                    alert("Something went wrong while saving payment info.");
                }
            },
            prefill: {
                name: formData.holderName || "",
                email: "", // optional
                contact: user.phoneNumber || ""
            },
            theme: {
                color: "#f45b0b"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff7f5] to-[#fffef5] ">
            {/* Navbar */}
            <div className="flex justify-between items-center px-9 py-7 bg-white border-b border-gray-200 gap-3 overflow-x-auto whitespace-nowrap rounded-md mb-6 ">
                <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
                    <Link to="/">
                        <FaArrowLeft className="text-[16px] text-[#333] cursor-pointer shrink-0" />
                    </Link>
                    <FaGift className="text-[20px] text-orange-600" />
                    <span className="font-semibold text-lg text-orange-600">
                        Shagun
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {[1, 2, 3, 4].map((num) => (
                        <div
                            key={num}
                            className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm font-semibold flex items-center justify-center"
                        >
                            {num}
                        </div>
                    ))}
                    <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-sm flex items-center justify-center">
                        <FaCheck />
                    </span>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
            >
                <h2 className="text-2xl font-bold">Budget & Bank Details</h2>
                
                {/* member and budget */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col flex-1 min-w-[250px]">
                        <label className="mb-1 font-medium">
                            Expected Members *
                        </label>
                        <select
                            name="members"
                            value={formData.members}
                            onChange={handleChange}
                            required
                            className="border rounded-md p-2"
                        >
                            <option value="">Select Members</option>
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="flex flex-col flex-1 min-w-[250px]">
                        <label className="mb-1 font-medium">
                            Budget Amount (₹) *
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="border rounded-md p-2"
                            placeholder="Enter budget amount"
                        />
                    </div>
                </div>

                {formData.amount && (
                    <div className="bg-[#fff4e6] border border-[#ffd7a3] p-4 rounded-lg space-y-2">
                        <h4 className="text-[#a15a00] font-semibold">
                            Service Fee Structure
                        </h4>
                        <p>
                            Event Budget Amount: ₹
                            {parseFloat(formData.amount).toLocaleString()}
                        </p>
                        <p>
                            Platform Fee (5% of budget): ₹
                            {platformFee.toFixed(1)}
                        </p>
                        <p>
                            Fixed Service Charges: ₹{fixedFee.toLocaleString()}
                        </p>
                        <hr />
                        <p className="font-bold text-[#9c2f00]">
                            Total Service Fee: ₹{totalFee.toFixed(1)}
                        </p>

                        <div className="bg-[#e7f0fe] border border-[#bcd9ff] p-4 rounded-lg mt-4">
                            <h5 className="text-[#1c4aa0] font-medium flex items-center gap-2">
                                <FaInfoCircle /> Refund Policy
                            </h5>
                            <p className="text-sm mt-1">
                                <strong>Important:</strong> If guests do not
                                utilize any amount from our kiosk during your
                                event, only the fixed service charge of ₹2,000
                                will be deducted. The remaining ₹
                                {platformFee.toFixed(1)} will be refunded to
                                your bank within 3–5 business days.
                            </p>
                        </div>
                    </div>
                )}

                <h4 className="text-lg font-semibold mt-4 flex items-center gap-2">
                    🧾 Bank Account Details (Required) *
                </h4>
                
                {/* Bank account number */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col flex-1 min-w-[250px]">
                        <label className="mb-1 font-medium">
                            Bank Account Number *
                        </label>
                        <input
                            type="number"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                            className="border rounded-md p-2"
                            placeholder="Enter account number"
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-[250px]">
                        <label className="mb-1 font-medium">
                            Account Holder Name *
                        </label>
                        <input
                            type="text"
                            name="holderName"
                            value={formData.holderName}
                            onChange={handleChange}
                            required
                            className="border rounded-md p-2"
                            placeholder="Enter account holder name"
                        />
                    </div>
                </div>
                
                {/* Bank name */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col flex-1 min-w-[250px]">
                        <label className="mb-1 font-medium">Bank Name *</label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            required
                            className="border rounded-md p-2"
                            placeholder="Enter bank name"
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-[250px]">
                        <label className="mb-1 font-medium">
                            Branch Name *
                        </label>
                        <input
                            type="text"
                            name="branchName"
                            value={formData.branchName}
                            onChange={handleChange}
                            required
                            className="border rounded-md p-2"
                            placeholder="Enter branch name"
                        />
                    </div>
                </div>

                {/* ifsc code */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">IFSC Code *</label>
                    <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleChange}
                        required
                        className="border rounded-md p-2"
                        placeholder="Enter IFSC code"
                    />
                </div>

                {/* check box  */}
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        name="accepted"
                        checked={formData.accepted}
                        onChange={handleChange}
                        required
                    />
                    <label className="text-sm font-medium">
                        I accept the terms and conditions *
                    </label>
                </div>

                {/* rules and regulation */}
                <p className="text-xs text-gray-600 mt-2 leading-snug">
                    • Indian tax rules apply • Damages to vending machine will
                    be charged • Account settlement may take 1–3 days • Company
                    liability limitations apply • All disputes are subject to
                    Hyderabad, Telangana jurisdiction only • Final decision of
                    the company will be binding and must be obeyed by the host •
                    Host agrees to comply with all legal matters as per company
                    policies
                </p>
                
                {/* complete registration button */}
                <button
                    type="submit"
                    disabled={!formData.accepted ||  !paymentSuccess}
                    className={`w-full py-3 rounded-lg font-bold text-white mt-4 ${
                        formData.accepted && paymentSuccess
                            ? "bg-[#0a0a23] hover:bg-black"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Complete Registration
                </button>

                {formData.amount && (
                    <div className="bg-[#fff2e5] border border-[#ffc89d] p-4 rounded-lg text-center mt-6">
                        <h4 className="text-[#e05d00] font-semibold flex items-center justify-center gap-2 text-lg">
                            <FaCreditCard />
                            {paymentSuccess
                                ? "Payment Completed ✅"
                                : `Pay Service Fee: ₹${totalFee.toFixed(1)}`}
                        </h4>

                        <p className="mt-2">
                            Amount to be charged:{" "}
                            <strong>₹{totalFee.toFixed(1)}</strong>
                        </p>

                        {!paymentSuccess ? (
                            <button
                                type="button"
                                onClick={handleRazorpayPayment}
                                className="mt-3 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                            >
                                Click for quick payment via Razorpay
                            </button>
                        ) : (
                            <p className="text-green-700 mt-3 font-medium">✅ Your payment has been recorded successfully.</p>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
