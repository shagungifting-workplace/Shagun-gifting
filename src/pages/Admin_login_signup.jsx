import { useState } from 'react';
import logo from './../assets/shagunicon.png';
import { Link } from 'react-router-dom';
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Sign_login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleToggle = (mode) => {
        setIsLogin(mode === 'login');
        setFormData({ fullName: '', email: '', password: '' });
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};
        if (!isLogin && !formData.fullName.trim()) {
            newErrors.fullName = 'Please enter your full name';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Please enter your email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Enter a valid email';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Please enter your password';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Minimum 6 characters required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                // 🔐 Login existing user
                const data = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                console.log("data from login:", data);

                // check is user is complete the payment or not
                const uid = data.user.uid;
                if (!uid) {
                    throw new Error("User ID not found");
                } else {
                    alert("Login successful!");
                    navigate("/host_dash");
                }
                
            } else {
                // Create user
                const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const uid = userCred.user.uid;
                console.log("uid from signup:", uid);

                // Store user data under: users/{uid}/userDetails/info
                await setDoc(doc(db, `admin/${uid}/adminDetails/info`), {
                    uid: uid,
                    fullName: formData.fullName,
                    email: formData.email,
                    createdAt: serverTimestamp(),
                });

                alert("Account created successfully!");
                navigate("/mobile_ver");
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert(error.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fef4ed]  flex flex-col items-center" id="host_sign_login">
            {/* ✅ Matching Host_dash Navbar */}
            <div className="w-full max-w-10xl flex justify-between items-center bg-white px-6 py-4 border-b border-[#f2c0a2] rounded-t-xl mb-6">
                <Link to="/">
                <a href="#" className="text-[#e56a1d] text-base font-medium hover:underline">
                    ← Back to Home
                </a>
                </Link>
                <img src={logo} alt="Shagun Logo" className="h-[50px]" />
            </div>

            {/* Header */}
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Host Account</h2>
                <p className="text-gray-600 text-sm">
                    Login or create an account to manage your events
                </p>
            </div>

            {/* Card */}
            <div className="bg-white max-w-md w-full px-6 py-8 rounded-xl shadow-lg text-center">
                {/* Tabs */}
                <div className="flex border border-gray-300 rounded-md overflow-hidden mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            isLogin ? 'bg-gray-100 font-semibold' : 'bg-gray-50'
                        }`}
                        onClick={() => handleToggle('login')}
                    >
                        ⇨ Login
                    </button>

                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            !isLogin ? 'bg-gray-100 font-semibold' : 'bg-gray-50'
                        }`}
                        onClick={() => handleToggle('signup')}
                    >
                        👤 Sign Up
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* full name */}
                    {!isLogin && (
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            {errors.fullName && (
                                <span className="text-red-600 text-xs">{errors.fullName}</span>
                            )}
                        </div>
                    )}

                    {/* email */}
                    <div>   
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && (
                            <span className="text-red-600 text-xs">{errors.email}</span>
                        )}
                    </div>
                    
                    {/* password */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <span
                            className="absolute right-3 top-2/4 -translate-y-1/2 cursor-pointer text-sm"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '👁' : ' '}
                        </span>
                        {errors.password && (
                            <span className="text-red-600 text-xs">{errors.password}</span>
                        )}
                    </div>
                    
                    {/* button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f36b1c] text-white py-2 rounded-md font-semibold hover:bg-[#e46010]"
                    >
                        {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>
            </div>

            <p className="mt-4 text-sm text-gray-700 text-center px-2 sm:px-4 break-words leading-relaxed">
                Need to register as a host first?
                <Link to="/mobile_ver"  className="text-[#ec6b19] font-medium"> Complete Host Registration</Link>

            </p>
        </div>
    );
}
