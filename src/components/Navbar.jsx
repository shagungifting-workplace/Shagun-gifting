import React, { useState, useEffect } from "react";
import { MdOutlinePeople } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { db  } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleDashboard = async () => {
        const user = auth.currentUser;
        const uid = user?.uid;

        if (!uid) {
            toast.error("User not logged in.");
            return;
        }

        const adminUID = import.meta.env.VITE_ADMIN_UID;
        console.log(adminUID, uid);

        if (uid == adminUID) {
            console.log("Navigating to admin dashboard");
            navigate("/admin");
            return;
        } 

        // Host case
        const docRef = doc(db, `users/${uid}/eventDetails/budget`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            if (data?.isComplete === true) {
                console.log("Navigating to host dashboard");
                navigate("/host_dash");
            } else {
                toast.error("Please complete your registration!");
                return;
            }
        } else {
            toast.error("Please complete your registration as a host to show the dashboard!");
            navigate("/hostlogin");
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#fef3eb]/70 backdrop-blur-sm border-b border-orange-200 shadow-sm py-4 px-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div onClick={() => navigate("/")} className="cursor-pointer">
                    <img
                        src="/logo.png"
                        alt="Shagun Icon"
                        className="md:h-14 h-12 w-auto"
                    />
                </div>

                {/* Desktop menu */}
                <ul className="hidden md:flex gap-4 text-gray-700 font-medium">
                    {!isLoggedIn ? (
                        <>
                            <li>
                                <Link to="/hostlogin">
                                    <button className="py-2 px-4 border border-gray-300 rounded-xl flex items-center gap-2">
                                        <MdOutlinePeople size={20} />
                                        Host Login
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="/adminAuth">
                                    <button className="py-2 px-4 border border-gray-300 rounded-xl flex items-center gap-2">
                                        <MdOutlinePeople size={20} />
                                        Admin Login
                                    </button>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="py-2 px-4 border border-gray-300 rounded-xl text-red-600 font-semibold"
                            >
                                Logout
                            </button>
                        </li>
                    )}

                    {isLoggedIn && 
                        <li>
                            <button
                                onClick={handleDashboard}
                                className="px-4 py-2 border border-gray-300 rounded-xl flex items-center gap-2"
                            >
                                <FaRegChartBar size={20} />
                                Dashboard
                            </button>
                        </li>
                    }
                </ul>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-2xl text-gray-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Mobile menu items */}
            {menuOpen && (
                <div className="md:hidden mt-4 space-y-4 px-4">
                    {!isLoggedIn ? (
                        <div className="flex flex-col gap-4">
                            <Link to="/hostlogin">
                                <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center gap-2 justify-center">
                                    <MdOutlinePeople size={20} />
                                    Host Login
                                </button>
                            </Link>
                            <Link to="/adminAuth">
                                <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center gap-2 justify-center">
                                    <MdOutlinePeople size={20} />
                                    Admin Login
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md text-red-600 font-semibold"
                        >
                            Logout
                        </button>
                    )}

                    {isLoggedIn && 
                        <button
                            onClick={handleDashboard}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 justify-center"
                        >
                            <FaRegChartBar size={20} />
                            Dashboard
                        </button>
                    }
                </div>
            )}
        </nav>
    );
};

export default Navbar;