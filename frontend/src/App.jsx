import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Routes, Route, useLocation } from "react-router-dom";

import './App.css'
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Budget from './pages/Budget';
import Dashboard from './pages/Dashboard';
import Profile from "./pages/Profile";

const App = () => {

  const { user } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login", "/register"];
  const showNavbar = user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
        <Route path='/income' element={<Income />} />
        <Route path='/expense' element={<Expense />} />
        <Route path='/budget' element={<Budget/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>

    </div>
  );
};

export default App;
