import React, { useState, useEffect } from "react";
import { MdOutlinePeople } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { db  } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import shagunIcon from "../assets/shagunicon.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [role, setRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);

                // 🧠 Try host path
                let roleData = null;
                const personalRef = doc(db, `users/${user.uid}/personalDetails/info`);
                const personalSnap = await getDoc(personalRef);

                if (personalSnap.exists()) {
                    roleData = personalSnap.data();
                    setRole("host");
                } else {
                    // 🧠 Try admin path
                    const adminRef = doc(db, `admin/${user.uid}/adminDetails/info`);
                    const adminSnap = await getDoc(adminRef);
                    if (adminSnap.exists()) {
                        roleData = adminSnap.data() ;
                        setRole("admin")
                    }
                }
                console.log("roledata", roleData);
                // setRole(roleData.role );
            } else {
                setIsLoggedIn(false);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

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

    const handleDashboard = () => {
        console.log("role:", role);
        if (role === "admin") {
            navigate("/admin");
        } else if (role === "host") {
            navigate("/host_dash");
        } else {
            toast.error("Unknown role or not logged in");
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-orange-200 shadow-sm py-4 px-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                    <img
                        src={shagunIcon}
                        alt="Shagun Icon"
                        className="h-10 w-auto"
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
                        <>
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
                        </>
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