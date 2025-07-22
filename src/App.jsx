import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Reg_com from "./pages/Reg_com.jsx";
import Budget_bank from "./pages/Budget_bank.jsx";
import Event_det from "./pages/Event_det.jsx";
import Host_dash from "./pages/Host_dash.jsx";
import Mobile_ver from "./pages/Mobile_ver.jsx";
import Mvp_demo from "./pages/Mvp_demo.jsx";
import Personal_det from "./pages/Personal_det.jsx";
import Sign_login from "./pages/Sign_login.jsx";
import ActiveEvents from "./pages/ActiveEvents.jsx";
import ProjectCodePage from "./pages/ProjectCodePage.jsx";
import Host_Dashboard from "./pages/Host_Dashboard.jsx";
import Admin_Sign_Login from "./pages/Admin_login_signup.jsx";
import GlobalLoader from './components/GlobalLoader';
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import AdminChangePassword from "./components/AdminChangePassword.jsx";


import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./utils/firebase";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
    const location = useLocation();

    const [isHostComplete, setIsHostComplete] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser;

            if (!user) return;

            // Check if UID matches Admin
            const adminUid = import.meta.env.VITE_ADMIN_UID;
            if (user.uid === adminUid) {
                setIsAdmin(true);
                return;
            }

            // Check host registration completion
            const docRef = doc(db, `users/${user.uid}/eventDetails/budget`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data()?.isComplete === true) {
                setIsHostComplete(true);
            }
        };

        checkUser();
    }, []);

    const hideLayoutRoutes = [
        "/admin",
        "/hostlogin",
        "/mobile_ver",
        "/personal_det",
        "/event_det",
        "/budget_bank",
        "/reg_com",
        "/active-events",
        "/privacy-policy",
        "/admin/changepassword",
    ];

    const hideLayout =
        hideLayoutRoutes.includes(location.pathname) ||
        location.pathname.startsWith("/project/");

    return (
        <>
            {!hideLayout && <Navbar />}
            <GlobalLoader />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute condition={isAdmin} redirectTo="/">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/adminAuth" element={<Admin_Sign_Login />} />
                <Route
                    path="/admin/changepassword"
                    element={
                        <ProtectedRoute condition={isAdmin} redirectTo="/">
                            <AdminChangePassword />
                        </ProtectedRoute>
                    }
                />
                {/* <Route path="/mvp_demo" element={<Mvp_demo />} /> */}
                <Route path="/hostlogin" element={<Sign_login />} />
                <Route path="/mobile_ver" element={<Mobile_ver />} />
                <Route path="/personal_det" element={<Personal_det />} />
                <Route path="/event_det" element={<Event_det />} />
                <Route path="/budget_bank" element={<Budget_bank />} />
                <Route path="/reg_com" element={<Reg_com />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route
                    path="/host_dash"
                    element={
                        <ProtectedRoute condition={isHostComplete} redirectTo="/hostlogin">
                            <Host_Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/active-events"
                    element={
                        <ProtectedRoute condition={isAdmin} redirectTo="/adminAuth">
                            <ActiveEvents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/project/:code"
                    element={
                        <ProtectedRoute condition={isAdmin} redirectTo="/adminAuth">
                            <ProjectCodePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={
                        <div className="p-10 text-center text-xl text-red-500">
                            404 - Page Not Found
                        </div>
                    }
                />
            </Routes>

            {!hideLayout && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
