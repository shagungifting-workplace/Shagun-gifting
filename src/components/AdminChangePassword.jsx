import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { auth, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export default function AdminChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setLoading(true);
        const currentUser = auth.currentUser;
        console.log("currentUser: ", currentUser);

        try {
            // Replace this with your backend/API call
            const adminRef = doc(db, `admin/${currentUser.uid}/adminDetails/info`);
            const adminSnap = await getDoc(adminRef);
            console.log("change: ",adminSnap);

            if (!adminSnap.exists()) {
                toast.error("Admin credentials not found.");
                setLoading(false);
                return;
            }

            const storedPassword = adminSnap.data().password;

            if (storedPassword !== oldPassword) {
                toast.error("Old password is incorrect.");
                setLoading(false);
                return;
            }

            // Update with new password
            await updateDoc(adminRef, { password: newPassword });

            toast.success("Password updated successfully!");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigate("/admin");
        } catch (err) {
            toast.error("❌ Error: " + err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f7f7] to-[#fff] px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex items-center mb-6">
                    <FaLock className="text-[#f45b0b] mr-2 text-lg" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Change Admin Password
                    </h2>
                </div>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Old Password
                </label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-sm"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                    New Password
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-sm"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg text-sm"
                />

                <button
                    onClick={handleChangePassword}
                    className="w-full bg-[#0e1328] hover:bg-[#1c2035] text-white font-semibold py-3 rounded-lg"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>
            </div>
        </div>
    );
}
