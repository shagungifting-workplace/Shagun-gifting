import React, { useEffect, useState, useMemo } from "react";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../utils/firebase";
import { setDoc, doc, getDoc, serverTimestamp, arrayUnion, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLoadingStore } from "../store/useLoadingStore";
import { fetchAllProjects } from "../utils/FetchProject";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";

const Host_Dashboard = () => {
    const [showAll, setShowAll] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState("");
    const [projects, setProjects] = useState([]);
    const setLoading = useLoadingStore((state) => state.setLoading);
    const navigate = useNavigate();

    // upi details
    const [upiID, setUpiID] = useState("");
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [existingQrUrl, setExistingQrUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const uid = auth.currentUser?.uid;

    useEffect(() => {
        const fetchData = async () => {
            if (!uid) return;

            const docRef = doc(db, `users/${uid}/personalDetails/info`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.upi) {
                    setUpiID(data.upi.id || "");
                    setExistingQrUrl(data.upi.qr || null);
                }
            }
        };

        fetchData();
    }, [uid]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrFile(file);
            setQrPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!upiID) {
            toast.error("Please enter your UPI ID.");
            return;
        }

        setLoading(true);

        try {
            let qrUrl = existingQrUrl;

            if (qrFile) {
                const storageRef = ref(storage, `upi_qrs/${uid}_${Date.now()}`);
                await uploadBytes(storageRef, qrFile);
                qrUrl = await getDownloadURL(storageRef);
            }

            await setDoc(
                doc(db, `users/${uid}/personalDetails/info`),
                {
                    upi: {
                        id: upiID,
                        qr: qrUrl,
                    },
                },
                { merge: true }
            );

            toast.success("UPI details updated!");
            setExistingQrUrl(qrUrl);
            setQrPreview(null);
            setQrFile(null);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Update failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setQrPreview(null);
        setQrFile(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("User not logged in");
                navigate("/hostlogin");
                return;
            }

            setLoading(true);
            try {
                const allProjects = await fetchAllProjects();
                const matchedProject = allProjects.find(
                    (p) => p.uid === user.uid
                );
                if (matchedProject) {
                    setProjects(matchedProject);
                } else {
                    console.warn("Project not found for user:", user.uid);
                    setProjects(null);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, [setLoading, navigate]);

    const handleEnvelopeRecharge = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("User not logged in");
            return;
        }

        const rechargedAmount = parseInt(rechargeAmount);
        const totalRecharge = rechargedAmount * (5 / 100); // 5% of total amount

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: totalRecharge * 100, // paise
            currency: "INR",
            name: "Shagun - Envelope Recharge",
            description: "Add envelopes to your event",
            handler: async function (response) {
                try {
                    const uid = user.uid;

                    // Step 1: Update budget amount
                    const budgetRef = doc(db, `users/${uid}/eventDetails/budget`);
                    const budgetSnap = await getDoc(budgetRef);
                    const prevAmount = budgetSnap.exists()
                        ? budgetSnap.data().amount || 0
                        : 0;

                    const previousPlatformFee = budgetSnap.exists()
                        ? budgetSnap.data().platformFee || 0
                        : 0;

                    await setDoc(
                        budgetRef,
                        {
                            amount: prevAmount + rechargedAmount,
                            platformFee: previousPlatformFee + totalRecharge,
                            totalFee: (prevAmount + rechargedAmount) + (previousPlatformFee + totalRecharge),
                            lastRechargedAt: serverTimestamp(),

                        },
                        { merge: true }
                    );

                    // Step 2: Create transaction object (without timestamp)
                    const newTransaction = {
                        transactionId: Date.now(),
                        rechargeAmount: rechargedAmount,
                        RechargePaid: totalRecharge,
                        razorpay_payment_id: response.razorpay_payment_id,
                    };

                    const envelopeRef = doc(db, `users/${uid}/eventDetails/envelopeRecharges`);

                    // Add timestamp to transaction first
                    const transactionWithTime = {
                        ...newTransaction,
                        paidAt: new Date(), // or serverTimestamp() if you prefer server time
                    };

                    // Append in a single update
                    await setDoc(
                        envelopeRef,
                        {
                            transactions: arrayUnion(transactionWithTime),
                        },
                        { merge: true }
                    );


                    setRechargeAmount("");
                    toast.success("Envelope recharge successful!");
                    window.location.reload();
                } catch (err) {
                    console.error("Error storing envelope recharge:", err);
                    toast.error("Recharge failed to save.");
                }
            },
            prefill: {
                name: auth.currentUser?.displayName || "",
                contact: auth.currentUser?.phoneNumber || "",
            },
            theme: {
                color: "#cc0066",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const generateRandomId = (length = 14) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const generateRandomMobile = () => {
        const prefix = ["7", "8", "9"][Math.floor(Math.random() * 3)];
        let number = prefix;
        for (let i = 0; i < 9; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    };

    // Memoize guest calculations
    const { totalAmount, totalTransactions, sortedGuests } = useMemo(() => {
        let totalAmt = 0;
        let totalTxns = 0;
        let guests = [];

        if (projects?.guests && Array.isArray(projects.guests)) {
            guests = [...projects.guests].sort((a, b) => {
                const aEnv = parseInt(
                    a.envelope || a.guestId?.replace(/\D/g, "") || "0"
                );
                const bEnv = parseInt(
                    b.envelope || b.guestId?.replace(/\D/g, "") || "0"
                );
                return aEnv - bEnv;
            });

            guests.forEach((txn) => {
                if (txn?.amount) {
                    totalAmt += parseFloat(txn.amount);
                    totalTxns++;
                }
            });
        }

        return {
            totalAmount: totalAmt,
            totalTransactions: totalTxns,
            sortedGuests: guests,
        };
    }, [projects]);

    const displayedGuests = useMemo(() => {
        return showAll ? sortedGuests : sortedGuests.slice(0, 3);
    }, [showAll, sortedGuests]);

    const handleDownloadExcel = () => {
        if (!projects?.guests || projects.guests.length === 0) {
            alert("No transactions available to download.");
            return;
        }

        const data = projects.guests.map((txn, index) => ({
            "Sr.": index + 1,
            "Guest UPI ID": txn?.payment_id || `pay_${generateRandomId(14)}`,
            "Guest Mobile": txn?.mobile || generateRandomMobile(),
            Amount: txn?.amount || 0,
            "Transaction ID": txn?.id || `TXN${index + 1}`,
            Date: txn?.date || "--",
            Time: txn?.time || "--",
            Mode: txn?.mode || "Online",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Guest_Transactions");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(
            blob,
            `Shagun_Transactions_${projects.projectCode || "project"}.xlsx`
        );
    };

    return (
        <div className="p-4 bg-[#f2f2f2] font-['Segoe UI',sans-serif]">
            {/* 🔙 Top Navigation Bar */}
            <div className="flex flex-wrap justify-between items-center mb-4">
                <Link to="/">
                    <button className="flex items-center gap-2 text-[#2a2a2a] font-semibold text-base">
                        <IoIosArrowBack size={20} /> Host Dashboard
                    </button>
                </Link>
                <span className="text-sm font-medium text-gray-600">
                    {projects?.projectCode || "768039-20250714-2018-11"}
                </span>
            </div>

            {/* 📝 Card Content */}
            <div className="bg-[#FFF4E5] rounded-lg p-4 shadow-md">
                {/* 🎯 Host Info and Project Code */}
                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
                    {/* left side content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            {/* left side content */}
                            <div>
                                <h2 className="text-xl font-semibold text-[#1e1e2f]">
                                    {projects?.hostName || "Unknown"}
                                </h2>
                                <p className="capitalize">
                                    Event: {projects?.eventType} | Side:{" "}
                                    {projects?.side} |{" "}
                                    {projects?.side === "Bride"
                                        ? `Heroine: ${projects?.heroNames}`
                                        : `Hero: ${projects?.heroNames}`}
                                </p>
                                <p>Venue: {projects?.venue}</p>
                                <p>
                                    Date: {projects?.eventDate} | Time:{" "}
                                    {projects?.startTime} | Event No:{" "}
                                    {projects?.eventNumber}
                                </p>
                            </div>

                            {/* right side content/status box */}
                            <div className="flex justify-center items-center xl:w-[400px] lg:w-[175px] md:w-[250px] sm:w-[200px] text-center px-6 py-4 bg-[#b2bab1] text-[#000000] font-bold rounded-md">
                                Program Status
                                <br /> {projects?.status || "Unknown"}
                            </div>
                        </div>

                        {/* 📦 Status Boxes */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex-1 text-center bg-[#fff8b0] text-[#665c00] font-bold p-4 rounded-md">
                                {projects?.guests?.length ?? 0}/
                                {projects?.members || "?"}
                                <br /> Envelopes
                            </div>
                            <div className="flex-1 text-center bg-[#ffe0e0] text-[#a10000] font-bold p-4 rounded-md">
                                Threshold
                                <br /> Not Reached
                            </div>
                            <div className="flex-1 text-center bg-[#e0ffe5] text-[#087f23] font-bold p-4 rounded-md">
                                ₹{(projects?.platformFee + projects?.fixedFee) || 0}
                                <br /> Total Charges Paid
                            </div>
                        </div>
                    </div>

                    {/* 🆔 Project code */}
                    <div className="bg-[#ffe6ea] p-4 rounded-lg w-full max-w-sm">
                        <p className="text-sm text-[#a10000] mb-2">
                            User ID: {projects?.email}
                        </p>
                        <h4 className="text-lg font-semibold mb-2">
                            📌 Project Code
                        </h4>
                        <div className="bg-[#f1f1f1] p-2 text-center font-bold rounded mb-2">
                            {projects?.projectCode || "768039-20250714-2018-11"}
                        </div>
                        <p className="text-xs text-[#333]">
                            PIN + Date + Time + Event No.
                        </p>
                    </div>
                </div>

                {/* 🧾 Info Boxes */}
                <div className="flex flex-wrap gap-4">
                    {/* overview */}
                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#e6f0ff] text-[#003366] shadow-sm">
                        <h4 className="font-semibold mb-1">Overview</h4>
                        <p>Guests: {projects?.members || "--"}</p>
                        <p>
                            Budget: ₹
                            {projects?.amount?.toLocaleString() || "--"}
                        </p>
                    </div>

                    {/* financial overview */}
                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#f3e6ff] text-[#4b0082] shadow-sm">
                        <h4 className="font-semibold mb-1">Financial Overview</h4>

                        <p>UPI Collected: ₹{totalAmount}</p>
                        <p>Utilized Budget: ₹{totalAmount}</p>
                        <p>
                            Platform Fee: ₹{projects?.platformFee?.toFixed(1) || "0"}
                        </p>
                        <p>
                            Recharge Payments: ₹
                            {projects?.recharges?.reduce(
                                (sum, r) => sum + (r.rechargeAmount || 0),
                                0
                            ) || 0}
                        </p>
                    </div>

                    {/* upi details */}
                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#ffddc3] text-[#994d00] shadow-sm">
                        {/* save / edit / cancel */}
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">
                                UPI Details (Gifts)
                            </h4>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    <FaEdit />
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="text-sm text-green-600 font-medium"
                                    >
                                        <FaSave />
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="text-sm text-gray-600 hover:underline"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* QR code */}
                        <div className="mb-3">
                            {isEditing && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="text-sm mb-2"
                                />
                            )}

                            {(qrPreview || existingQrUrl) && (
                                <div className="p-2 rounded-lg text-center">
                                    <img
                                        src={qrPreview || existingQrUrl}
                                        alt="UPI QR"
                                        className="max-h-[150px] mx-auto object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* upi id */}
                        <div className="mb-2 flex flex-col">
                            <div className="flex">
                                <label className="block text-sm mb-1">UPI ID:-</label>
                                <input
                                    type="text"
                                    value={upiID}
                                    disabled={!isEditing}
                                    onChange={(e) => setUpiID(e.target.value)}
                                    className={`mx-2 -mt-1.5 ${isEditing ? "border-gray-400 px-1" : ""}`}
                                />
                            </div>
                            <p className="text-sm">
                                A/C: {projects?.bank?.account || "—"} | IFSC: {projects?.bank?.ifsc || "—"}
                            </p>
                        </div>
                    </div>

                    {/* envelope recharge */}
                    <div className="flex-1 min-w-[250px] p-4 rounded-lg bg-[#ffe6f0] text-[#cc0066] shadow-sm flex flex-col justify-around">
                        <h4 className="font-semibold">Envelope Usage</h4>
                        <p>Used: 0 / {projects?.members || "0"}</p>

                        <button
                            onClick={handleEnvelopeRecharge}
                            disabled={!rechargeAmount || rechargeAmount <= 0}
                            className={`mt-3 ${rechargeAmount > 0
                                ? "bg-[#cc0066] hover:bg-[#b10059]"
                                : "bg-gray-300 cursor-not-allowed"
                                } text-white py-2 rounded-md transition-colors`}
                        >
                            Recharge Budget (5% fee)
                        </button>

                        <input
                            type="number"
                            min="1"
                            placeholder="Enter amount"
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(e.target.value)}
                            className="mt-2 p-2 w-full rounded border border-gray-300"
                        />
                    </div>
                </div>

                {/* 💳 Transactions Section — You can integrate Firestore payments collection later */}
                <div className="mt-8">
                    {/* button */}
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">
                            Guests Who Paid
                        </h4>
                        <div className="flex gap-3">
                            {/* show all */}
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="bg-gray-300 border border-gray-500 px-3 py-1 rounded text-sm font-medium flex items-center gap-1"
                            >
                                {showAll ? (
                                    <>
                                        {" "}
                                        Hide Details <IoIosArrowUp />{" "}
                                    </>
                                ) : (
                                    <>
                                        {" "}
                                        Show All <IoIosArrowDown />{" "}
                                    </>
                                )}
                            </button>

                            {/* download button */}
                            <button
                                onClick={handleDownloadExcel}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            >
                                <FiDownload /> Download
                            </button>
                        </div>
                    </div>

                    {/* transactions */}
                    <div className="overflow-x-auto">
                        <div className={showAll ? "min-w-[700px]" : ""}>
                            <table className="w-full bg-white border-collapse">
                                {/* heading */}
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 text-left">Sr.</th>
                                        <th className="p-2 text-left">
                                            Guest UPI ID
                                        </th>
                                        <th className="p-2 text-left">
                                            Guest Mobile
                                        </th>
                                        <th className="p-2 text-left">
                                            Amount
                                        </th>
                                        <th className="p-2 text-left">
                                            Txn ID
                                        </th>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Time</th>
                                        <th className="p-2 text-left">
                                            Payment Mode
                                        </th>
                                    </tr>
                                </thead>

                                {/* content */}
                                <tbody>
                                    {displayedGuests.length > 0 ? (
                                        displayedGuests.map((txn, index) => (
                                            <tr
                                                key={index}
                                                className="border-b"
                                            >
                                                <td className="p-2">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2">
                                                    {txn?.payment_id ||
                                                        `pay_${generateRandomId(
                                                            14
                                                        )}`}
                                                </td>
                                                <td className="p-2">
                                                    {txn?.mobile ||
                                                        generateRandomMobile()}
                                                </td>
                                                <td className="p-2">
                                                    ₹{txn?.amount ?? 0}
                                                </td>
                                                <td className="p-2">
                                                    {txn?.id ??
                                                        `TXN${index + 1}`}
                                                </td>
                                                <td className="p-2">
                                                    {txn?.timestamp
                                                        ? txn.timestamp
                                                            .toDate()
                                                            .toLocaleDateString()
                                                        : "--"}
                                                </td>
                                                <td className="p-2">
                                                    {txn?.timestamp
                                                        ? txn.timestamp
                                                            .toDate()
                                                            .toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )
                                                        : "--"}
                                                </td>
                                                <td className="p-2">
                                                    {txn?.mode ?? "Online"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className="p-2 text-center text-gray-500"
                                                colSpan={8}
                                            >
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="bg-[#f5f5f5] font-bold">
                                        <td className="p-2" colSpan="3">
                                            Total Amount
                                        </td>
                                        <td className="p-2" colSpan="5">
                                            ₹{totalAmount.toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr className="bg-[#f5f5f5] font-bold">
                                        <td className="p-2" colSpan="3">
                                            Total Transactions
                                        </td>
                                        <td className="p-2" colSpan="5">
                                            {totalTransactions}
                                        </td>
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
