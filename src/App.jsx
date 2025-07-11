import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

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
    </Router>
  );
}

export default App;
