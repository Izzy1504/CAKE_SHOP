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
import OrderUser from './components/Orders/OrderUser';
import OrderDetail from './components/Orders/OrderDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectRoute';
import Orderdetail from './components/Orders/OrderDetail';
function App() {
  const { showCart } = useStateContext();
  const location = useLocation();

  useEffect(() => {
    document.querySelector("body").style.overflow = showCart ? "hidden" : "visible";
  }, [showCart]);

  const hideLayout = location.pathname === '/UserAccountPage';
  const hideCta = location.pathname === '/PaymentPage';
  const hideOrders = location.pathname === '/PaymentPage';
  const hideLayout1 = location.pathname === '/admin' || location.pathname === '/Admin';
  const hideLayout2 = location.pathname === '/admin/add-product';
  const hideLayout3 = matchPath('/admin/edit-product/:id', location.pathname);
  const hideLayout4 = location.pathname === '/admin/orders';;
  const hideLayout5 = location.pathname === '/admin' || location.pathname === '/Admin';
  const hideLayout6 = location.pathname === '/Login';
  const hideLayout7 = location.pathname === '/admin/products';
  const userDetailHide = location.pathname === '/userDetail' || location.pathname === '/order';

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideCta && !hideLayout7 && !hideLayout && !hideLayout1 && !hideLayout2 && !hideLayout3 && !hideLayout4 && <Navbar />}
      {showCart && !hideOrders && !hideLayout1 && !hideLayout2 && !hideLayout3 && <Orders />}
      <ToastContainer 
          position="top-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/cakes/:slug' element={<CakeDetails />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<Cancel />} />
        <Route path='/UserAccountPage' element={<UserAccountPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/PaymentPage' element={<PaymentPage />} />
        <Route path='/userDetail' element={<UserDetail />} />
        <Route path='/order/:id' element={<OrderDetail />} />
        <Route
          path='/admin'
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/products'
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/add-product'
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/edit-product/:id'
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route path="/cake-details/:id" element={<CakeDetails />} />
        <Route
          path='/admin/orders'
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <OrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/accounts'
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AccountManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideLayout && !hideCta && !hideLayout1 && !hideLayout2 && !hideLayout3 && !hideLayout4 && hideLayout6 && <Cta />}
      {!hideLayout && !hideCta  && !hideLayout4 && !hideLayout5 && !userDetailHide && <Footer />}
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