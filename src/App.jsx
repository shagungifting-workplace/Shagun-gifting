import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Reg_com from "./pages/Reg_com.jsx";
import Budget_bank from "./pages/Budget_bank.jsx";
import Event_det from "./pages/Event_det.jsx";
import Host_dash from "./pages/Host_dash.jsx";
import Mobile_ver from "./pages/Mobile_ver.jsx";
import Mvp_demo from "./pages/Mvp_demo.jsx";
import Personal_det from "./pages/Personal_det.jsx";
import Sign_login from "./pages/Sign_login.jsx";

function AppContent() {
  const location = useLocation();

  const hideLayoutRoutes = ['/admin', '/hostlogin'];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/mvp_demo" element={<Mvp_demo/>} />

        <Route
          path="/hostlogin"
          element={<div className="p-10 text-center text-xl">Coming Soon</div>}
        />
        <Route
          path="*"
          element={<div className="p-10 text-center text-xl text-red-500">404 - Page Not Found</div>}
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
      {/*<Reg_com/>*/}
      {/*<Budget_bank/>*/}
      {/*<Event_det/>*/}
      {/*<Host_dash/>*/}
      {/*  <Mobile_ver/>*/}
      {/*  <Mvp_demo/>*/}
      {/*  <Personal_det/>*/}
      {/*  <Sign_login/>*/}
    </Router>

  );
}

export default App;
