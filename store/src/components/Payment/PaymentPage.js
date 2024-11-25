import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.scss';
import Navbar from '../Navbar/Navbar'; // Ensure the path is correct
import Footer from '../Footer/Footer'; // Ensure the path is correct
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from '../../context/StateContextProvider'; // Import context nếu cần

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCartItems, setTotalPrice, setTotalQty } = useStateContext(); // Sử dụng context nếu cần
  const [cartItems, setLocalCartItems] = useState(location.state?.cartItems || []);
  const [totalPrice, setLocalTotalPrice] = useState(location.state?.totalPrice || 0);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const backendURL = 'http://26.214.87.26:8080';

  useEffect(() => {
    // Fetch user information from API
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/api/users/info`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const userData = response.data;
          setCustomerInfo({
            name: userData.name,
            phone: userData.phoneNumber,
            email: userData.email,
            address: userData.address,
          });
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
    console.log('Cart items length:', cartItems.length);
    console.log('Cart items:', cartItems);
    console.log('Total price:', totalPrice);
  }, [backendURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      console.error("Payment method is required");
      toast.error('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    try {
      const data = {
        "shippingAddress": customerInfo.address,
        "paymentMethod": selectedPaymentMethod,
        "orderDetails": cartItems.map(item => ({
          "productId": item.id,
          "quantity": item.quantity || 1,
          "price": item.price
        }))
      };
      console.log(data);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendURL}/api/orders`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response);
      // Handle success
      toast.success('Đơn hàng đã được gửi thành công!');
      // Clear cart items
      localStorage.removeItem('buyNowItem');
      localStorage.removeItem('cartItems');
      // setCartItems([]); // Ensure setCartItems is called correctly
      // setTotalPrice(0);
      // setTotalQty(0);
      // Navigate to orders page and reload
      setTimeout(() => {
        navigate('/userDetail', { replace: true });
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting order:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      toast.error('Gửi đơn hàng thất bại!');
    }
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.paymentPage}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.orderInfo}>
          <h2>Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  <span>{item.name} (x{item.quantity || 1})</span>
                  <span>{formatPrice(item.price * (item.quantity || 1))} vnđ</span>
                </li>
              ))}
              <li className={styles.total}>
                <span>Total</span>
                <span>{formatPrice(totalPrice)} vnđ</span>
              </li>
            </ul>
          )}
          <button onClick={handleGoBack} style={{ marginTop: '50px' }}>Go Back</button>
        </div>
        <div className={styles.customerInfo}>
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleChange}
                autoComplete="name"
                readOnly
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={customerInfo.phone}
                onChange={handleChange}
                autoComplete="tel"
                readOnly
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleChange}
                autoComplete="email"
                readOnly
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={customerInfo.address}
                onChange={handleChange}
                autoComplete="street-address"
                readOnly
              />
            </div>
            <button type="button" onClick={() => navigate('/profile')}>Edit</button>
            <div className={styles.paymentMethods}>
              <h2>Payment Methods</h2>
              {/*  */}
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedPaymentMethod === 'cod'}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
              {/*  */}
            </div>
            {/*  */}
            <button type="submit">Submit Order</button>
          </form>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default PaymentPage;