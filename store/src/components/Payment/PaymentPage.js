import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PaymentPage.module.scss';
import Navbar from '../Navbar/Navbar'; // Đảm bảo đường dẫn đúng
import Footer from '../Footer/Footer'; // Đảm bảo đường dẫn đúng

const PaymentPage = () => {
  const location = useLocation();
  const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    ward: '',
    district: '',
    city: '',
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý thanh toán với Stripe ở đây
  };

  const handlePaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'MoMo') {
      setQrCodeUrl('/QR_momo1.png'); // Đường dẫn đến mã QR MoMo trong thư mục public
    } else if (method === 'ZaloPay') {
      setQrCodeUrl('/zalopay-qr-code.png'); // Đường dẫn đến mã QR ZaloPay trong thư mục public
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.paymentPage}>
        <div className={styles.orderInfo}>
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.cakeName} - Quantity: {item.quantity} - ${item.details.price * item.quantity}
              </li>
            ))}
          </ul>
          <h3>Total: ${totalPrice}</h3>
          <h2>Payment Methods</h2>
          <button className={styles.paymentButton} onClick={() => handlePaymentMethod('MoMo')}>
            <img src="/icons/momo.png" alt="MoMo" className={styles.icon} /> Pay with MoMo
          </button>
          <button className={styles.paymentButton} onClick={() => handlePaymentMethod('ZaloPay')}>
            <img src="/icons/zalopay.png" alt="ZaloPay" className={styles.icon} /> Pay with ZaloPay
          </button>
          {selectedPaymentMethod && (
            <div className={styles.qrCodeContainer}>
              <h3>Scan the QR code to pay with {selectedPaymentMethod}</h3>
              <img src={qrCodeUrl} alt={`${selectedPaymentMethod} QR Code`} className={styles.qrCode} />
            </div>
          )}
        </div>
        <div className={styles.customerInfo}>
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" name="name" value={customerInfo.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input type="text" name="phone" value={customerInfo.phone} onChange={handleChange} pattern="\d{10}" required />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" value={customerInfo.email} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Street</label>
              <input type="text" name="street" value={customerInfo.street} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Ward</label>
              <input type="text" name="ward" value={customerInfo.ward} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>District</label>
              <input type="text" name="district" value={customerInfo.district} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>City</label>
              <input type="text" name="city" value={customerInfo.city} onChange={handleChange} required />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;