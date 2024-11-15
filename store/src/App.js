import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, matchPath } from 'react-router-dom';
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
import UserDetail from './components/User/UserDetail'
import Login from './components/User/User2';
import { useStateContext } from './context/StateContextProvider';
import PaymentPage from './components/Payment/PaymentPage';
import Admin from './components/admin/admin';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import AccountManagement from './components/admin/AccountManagement';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';

function App() {
  const { showCart } = useStateContext();
  const location = useLocation();

  useEffect(() => {
    document.querySelector("body").style.overflow = showCart ? "hidden" : "visible";
  }, [showCart]);

  const hideLayout = location.pathname === '/UserAccountPage';
  const hideCta = location.pathname === '/PaymentPage';
  const hideOrders = location.pathname === '/PaymentPage';
  const hideLayout1 = location.pathname === '/admin';
  const hideLayout2 = location.pathname === '/admin/add-product';
  const hideLayout3 = matchPath('/admin/edit-product/:id', location.pathname);
  const hideLayout4 = location.pathname === '/admin/orders';;
  const hideLayout5 = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideCta && !hideLayout && !hideLayout1 && !hideLayout2 && !hideLayout3 && !hideLayout4 && <Navbar />}
      {showCart && !hideOrders && !hideLayout1 && !hideLayout2 && !hideLayout3 && <Orders />}
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/cakes/:slug' element={<CakeDetails />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<Cancel />} />
        <Route path='/UserAccountPage' element={<UserAccountPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/PaymentPage' element={<PaymentPage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/products' element={<ProductManagement />} />
        <Route path='/admin/add-product' element={<AddProduct />} />
        <Route path='/admin/edit-product/:id' element={<EditProduct />} />
        <Route path="/cake-details/:id" element={<CakeDetails />} />
        <Route path='/admin/orders' element={<OrderManagement />} />
        <Route path='/admin/accounts' element={<AccountManagement />} />
        <Route path='/user/:id' element={<UserDetail />} />
      </Routes>
      {!hideLayout && !hideCta && !hideLayout1 && !hideLayout2 && !hideLayout3 && !hideLayout4 && <Cta />}
      {!hideLayout && !hideCta  && !hideLayout4 && !hideLayout5 && <Footer />}
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