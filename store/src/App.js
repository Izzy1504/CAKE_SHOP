import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Cta from './components/Cta/Cta';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage';
import CakeDetails from './components/Cakes/CakeDetails';
import About from './components/About/About';
import Orders from './components/Orders/Orders';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import UserAccountPage from './components/User/User';
import Login from './components/User/User2';
import { useStateContext } from './context/StateContextProvider';
import PaymentPage from './components/Payment/PaymentPage';


function App() {
  const { showCart } = useStateContext();
  const location = useLocation();

  useEffect(() => {
    document.querySelector("body").style.overflow = showCart ? "hidden" : "visible";
  }, [showCart]);

  const hideLayout = location.pathname === '/UserAccountPage';
  const hideCta = location.pathname === '/PaymentPage';
  const hideOrders = location.pathname === '/PaymentPage';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* {!hideCta && <Navbar />} */}
      {!hideLayout&& !hideCta && <Navbar />}
      {showCart && !hideOrders && <Orders />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/cakes/:slug' element={<CakeDetails />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<Cancel />} />
        <Route path='/UserAccountPage' element={<UserAccountPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/PaymentPage' element={<PaymentPage />} />
      </Routes>
      {/* {!hideCta && <Cta />} */}
      {!hideLayout && !hideCta && <Cta />}
      {!hideLayout && !hideCta && <Footer />}
      {/* {!hideCta && <Footer />} */}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}