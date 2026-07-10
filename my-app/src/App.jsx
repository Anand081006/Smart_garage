import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/Customer/Contact";
import Service from "./pages/Services/Service";
import Bookservice from "./pages/Services/Bookservice";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* Login and Register - NO padding */}
      <Routes>
        <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/Register" element={<Register />} />

        {/* All other pages - WITH padding */}
        <Route path="/*" element={
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Services" element={<Service />} />
              <Route path="/Bookservice" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Bookservice />
                </ProtectedRoute>
              } />
              <Route path="/CoustomerDashboard" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        } />
      </Routes>

      <Footer isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;