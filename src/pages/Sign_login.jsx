import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "./../assets/shagunicon.png";
import { Link } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sign_login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleToggle = (mode) => {
        setIsLogin(mode === "login");
        setFormData({ fullName: "", email: "", password: "" });
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};
        if (!isLogin && !formData.fullName.trim()) {
            newErrors.fullName = "Please enter your full name";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Please enter your email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Please enter your password";
        } else if (formData.password.length < 8) {
            newErrors.password = "Minimum 8 characters required";
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
        const suggestionValues = Object.values(suggestions);
        const isPasswordValid = suggestionValues.every(Boolean);

        if (!isPasswordValid) {
            setErrors({
                ...errors,
                password: "Password does not meet the required criteria.",
            });
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                // 🔐 Login existing user
                const data = await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                console.log("data from login:", data);

                // check is user is complete the payment or not
                const uid = data.user.uid;
                if (!uid) {
                    toast.error("User ID not found");
                    return;
                }
                const adminUid = import.meta.env.VITE_ADMIN_UID;
                if (uid === adminUid) {
                    toast.error(
                        "You are an admin please login from admin panel!"
                    );
                    navigate("/adminAuth");
                    return;
                }
                try {
                    const docRef = doc(db, `users/${uid}/eventDetails/budget`);
                    const docSnap = await getDoc(docRef);
                    console.log(docSnap);

                    const personalDetailsRef = doc(
                        db,
                        `users/${uid}/personalDetails/info`
                    );
                    const personalDetailsSnap = await getDoc(
                        personalDetailsRef
                    );
                    console.log(personalDetailsSnap);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data?.isComplete === true) {
                            toast.success("Login successful!", {
                                duration: 3000,
                                position: "top-center",
                            });
                            navigate("/host_dash");
                            return;
                        } else {
                            toast.error(
                                "Please do complete your registraion !"
                            );
                            navigate("/personal_det");
                            return;
                        }
                    }

                    if (personalDetailsSnap.exists()) {
                        const personalData = personalDetailsSnap.data();
                        if (!personalData?.phone) {
                            navigate("/mobile_ver");
                            return;
                        } else if (personalData?.phone) {
                            navigate("/host_dash");
                            return;
                        }
                    } else {
                        toast.error("Please complete your registraion !");
                        navigate("/mobile_ver");
                        return;
                    }
                } catch (error) {
                    console.error("Error fetching isComplete:", error);
                }
            } else {
                // Create user
                const userCred = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
                const uid = userCred.user.uid;
                console.log("uid from signup:", uid);

                // Store user data under: users/{uid}/userDetails/info
                await setDoc(doc(db, `users/${uid}/personalDetails/info`), {
                    uid: uid,
                    fullName: formData.fullName,
                    email: formData.email,
                    role: "host",
                    createdAt: serverTimestamp(),
                });

                await setDoc(
                    doc(db, `users/${uid}`),
                    {
                        registeredAt: serverTimestamp(), // Just one small field
                    },
                    { merge: true }
                );

                toast.success("Account created successfully!", {
                    duration: 3000,
                    position: "top-center",
                });
                navigate("/mobile_ver");
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error(error.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-[#fef4ed]  flex flex-col items-center"
            id="host_sign_login"
        >
            {/* ✅ Matching Host_dash Navbar */}
            <div className="w-full max-w-10xl flex justify-between items-center bg-white px-6 py-4 border-b border-[#f2c0a2] rounded-t-xl mb-6">
                <Link to="/">
                    <a
                        href="#"
                        className="text-[#e56a1d] text-base font-medium hover:underline"
                    >
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
                            isLogin ? "bg-gray-100 font-semibold" : "bg-gray-50"
                        }`}
                        onClick={() => handleToggle("login")}
                    >
                        ⇨ Login
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            !isLogin
                                ? "bg-gray-100 font-semibold"
                                : "bg-gray-50"
                        }`}
                        onClick={() => handleToggle("signup")}
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
                                onFocus={() => setIsPasswordFocused(false)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fullName: e.target.value,
                                    })
                                }
                            />
                            {errors.fullName && (
                                <span className="text-red-600 text-xs">
                                    {errors.fullName}
                                </span>
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
                            onFocus={() => setIsPasswordFocused(false)}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                        {errors.email && (
                            <span className="text-red-600 text-xs">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* password */}
                    <div className="relative">
                        {/* Input + Eye Icon Container */}
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
                                <p
                                    className={
                                        suggestions.isMinLength
                                            ? "text-green-600"
                                            : "text-orange-600"
                                    }
                                >
                                    • Minimum 8 characters
                                </p>
                                <p
                                    className={
                                        suggestions.hasUppercase
                                            ? "text-green-600"
                                            : "text-orange-600"
                                    }
                                >
                                    • At least one uppercase letter (A–Z)
                                </p>
                                <p
                                    className={
                                        suggestions.hasLowercase
                                            ? "text-green-600"
                                            : "text-orange-600"
                                    }
                                >
                                    • At least one lowercase letter (a–z)
                                </p>
                                <p
                                    className={
                                        suggestions.hasNumber
                                            ? "text-green-600"
                                            : "text-orange-600"
                                    }
                                >
                                    • At least one number (0–9)
                                </p>
                                <p
                                    className={
                                        suggestions.hasSpecialChar
                                            ? "text-green-600"
                                            : "text-orange-600"
                                    }
                                >
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
                        {loading
                            ? "Processing..."
                            : isLogin
                            ? "Sign In"
                            : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
