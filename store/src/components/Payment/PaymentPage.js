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
            name: userData.info?.name || '',
            phone: userData.info?.phoneNumber || '',
            email: userData.info?.email || '',
            address: userData.info?.address || '',
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
          <button onClick={handleGoBack} className={styles.goBackButton}>Go Back</button>
        </div>
        <div className={styles.customerInfo}>
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <p className={styles.infoText}>{customerInfo.name}</p>
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <p className={styles.infoText}>{customerInfo.phone}</p>
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <p className={styles.infoText}>{customerInfo.email}</p>
            </div>
            <div className={styles.formGroup}>
              <label>Address</label>
              <p className={styles.infoText}>{customerInfo.address}</p>
            </div>
            <button type="button" onClick={() => navigate('/userDetail')} className={styles.editButton}>Edit</button>
            <div className={styles.paymentMethods}>
              <h2>Payment Methods</h2>
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
            </div>
            <button type="submit" className={styles.submitButton}>Submit Order</button>
          </form>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default PaymentPage;