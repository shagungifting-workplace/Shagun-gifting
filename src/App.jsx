import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Reg_com from './pages/Reg_com.jsx';
import Budget_bank from './pages/Budget_bank.jsx';
import Event_det from './pages/Event_det.jsx';
import Host_dash from './pages/Host_dash.jsx';
import Mobile_ver from './pages/Mobile_ver.jsx';
import Mvp_demo from './pages/Mvp_demo.jsx';
import Personal_det from './pages/Personal_det.jsx';
import Sign_login from './pages/Sign_login.jsx';
import ActiveEvents from './pages/ActiveEvents.jsx';
import ProjectCodePage from './pages/ProjectCodePage.jsx';

function AppContent() {
  const location = useLocation();

  const hideLayoutRoutes = [
    '/admin',
    '/hostlogin',
    '/mobile_ver',
    '/personal_det',
    '/event_det',
    '/budget_bank',
    '/reg_com',
    '/active-events',
  ];

  const hideLayout =
    hideLayoutRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/project/');

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/mvp_demo" element={<Mvp_demo />} />
        <Route path="/hostlogin" element={<Sign_login />} />
        <Route path="/mobile_ver" element={<Mobile_ver />} />
        <Route path="/personal_det" element={<Personal_det />} />
        <Route path="/event_det" element={<Event_det />} />
        <Route path="/budget_bank" element={<Budget_bank />} />
        <Route path="/reg_com" element={<Reg_com />} />
        <Route path="/active-events" element={<ActiveEvents />} />
        <Route path="/project/:code" element={<ProjectCodePage />} />
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
