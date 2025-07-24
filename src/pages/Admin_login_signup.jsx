import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Admin_Sign_Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
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

    const validatePassword = (password) => {
        return {
            isMinLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const [suggestions, setSuggestions] = useState({
        isMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const data = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log("data from login:", data);

            const uid = data?.user?.uid;
            if (!uid) {
                toast.error("User ID not found");
            } else {
                toast.success("Login successful!");
                navigate("/admin");
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error(error.message || "Authentication failed.");
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
                <img src="/logo.png" alt="Shagun Logo" className="h-[50px]" />
            </div>

            {/* Header */}
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Admin Login</h2>
                <p className="text-gray-600 text-sm">
                    Login to manage your events
                </p>
            </div>

            {/* Form */}
            <div className="bg-white max-w-md w-full px-6 py-8 rounded-xl shadow-lg text-center">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* email */}
                    <div>   
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={formData.email}
                            onFocus={() => setIsPasswordFocused(false)}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && (
                            <span className="text-red-600 text-xs">{errors.email}</span>
                        )}
                    </div>
                    
                    {/* Input + Eye Icon Container */}
                    <div className="relative">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                value={formData.password}
                                onFocus={() => setIsPasswordFocused(true)}
                                onChange={(e) => {
                                    const pwd = e.target.value;
                                    setFormData({ ...formData, password: pwd });
                                    setSuggestions(validatePassword(pwd));
                                }}
                            />
                            <span
                                aria-label="Toggle password visibility"
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Password suggestions below input */}
                        {isPasswordFocused && (
                            <div className="text-xs text-gray-600 mt-1 space-y-1">
                                <p className={ suggestions.isMinLength ? "text-green-600" : "text-orange-600" }>
                                    • Minimum 8 characters
                                </p>
                                <p className={ suggestions.hasUppercase ? "text-green-600" : "text-orange-600" }>
                                    • At least one uppercase letter (A–Z)
                                </p>
                                <p className={ suggestions.hasLowercase ? "text-green-600" : "text-orange-600" }>
                                    • At least one lowercase letter (a–z)
                                </p>
                                <p className={ suggestions.hasNumber ? "text-green-600" : "text-orange-600" }>
                                    • At least one number (0–9)
                                </p>
                                <p className={ suggestions.hasSpecialChar ? "text-green-600" : "text-orange-600" }>
                                    • At least one special character (!@#$...)
                                </p>
                            </div>
                        )}

                        {errors.password && (
                            <span className="text-red-600 text-xs animate-bounce">
                                {errors.password}
                            </span>
                        )}
                    </div>    
                    
                    {/* button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f36b1c] text-white py-2 rounded-md font-semibold hover:bg-[#e46010]"
                    >
                        {loading ? "Loading..." : "Log In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
