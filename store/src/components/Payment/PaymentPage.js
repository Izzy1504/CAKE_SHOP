import React, { useState, useEffect } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", customerInfo);
  };

  return (
    <div className={styles.paymentPage}>
      <Navbar />
      <div className={styles.container}>
        <h1>Payment Page</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={customerInfo.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleChange}
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
              value={customerInfo.street}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;