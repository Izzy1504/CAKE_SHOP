import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PaymentPage.module.scss';
import Navbar from '../Navbar/Navbar'; // Đảm bảo đường dẫn đúng
import Footer from '../Footer/Footer'; // Đảm bảo đường dẫn đúng
import axios from 'axios';

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

  const [address, setAddress] = useState('')

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Fetch cities from API
    fetch("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1")
      .then((response) => response.json())
      .then((data) => setCities(data.data.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevData) => ({
      ...prevData,
      [name]: value,
      district: '',
      ward: '',
    }));

    // Fetch districts based on selected city
    fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${value}&limit=-1`)
      .then((response) => response.json())
      .then((data) => setDistricts(data.data.data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevData) => ({
      ...prevData,
      [name]: value,
      ward: '',
    }));

    // Fetch wards based on selected district
    fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${value}&limit=-1`)
      .then((response) => response.json())
      .then((data) => setWards(data.data.data))
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(cartItems);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const data = {
        "shippingAddress": address,
        // "status": "PROCESSING",
        "orderDetails": cartItems.map(item => ({
          "productId": item.id,
          "quantity": item.quantity,
          "price": item.price
        }))
      }
      console.log(data);
      const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dWFuYW5oIiwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfVVNFUiJ9XSwiaWF0IjoxNzMxMzQzODQyLCJleHAiOjE3MzEzNDQxNDJ9.g49L5rtvxl-fWjmbazsD8lNwdsxrWh1-Ij2kLRKgOJg" // token value is static, can change when make login function
      const response = await axios.post(
        `http://26.170.181.245:8080/api/orders`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response); // address need fix  // add if response success can set state null // when success need move on page ORDERS
    } catch (error) {
      
    }
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className={styles.paymentPage}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.orderInfo}>
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <span>{item.name} (x{item.quantity})</span>
                <span>{formatPrice(item.price * item.quantity)} vnđ</span>
              </li>
            ))}
            <li className={styles.total}>
              <span>Total</span>
              <span>{formatPrice(totalPrice)} vnđ</span>
            </li>
          </ul>
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
              />
            </div>
            <div>
              <label>City</label>
              <select
                name="city"
                value={customerInfo.city}
                onChange={handleCityChange}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>District</label>
              <select
                name="district"
                value={customerInfo.district}
                onChange={handleDistrictChange}
                disabled={!customerInfo.city}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Ward</label>
              <select
                name="ward"
                value={customerInfo.ward}
                onChange={handleChange}
                disabled={!customerInfo.district}
              >
                <option value="">Select Ward</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
              />
            </div>
            <div className={styles.paymentMethods}>
              <h2>Payment Methods</h2>
              <div>
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={selectedPaymentMethod === 'creditCard'}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor="creditCard">Credit Card</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="qrCode"
                  name="paymentMethod"
                  value="qrCode"
                  checked={selectedPaymentMethod === 'qrCode'}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor="qrCode">QR Code</label>
              </div>
            </div>
            {selectedPaymentMethod === 'qrCode' && (
              <div className={styles.qrCode}>
                <img src={qrCodeUrl} alt="QR Code" />
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;