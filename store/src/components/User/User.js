import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "./User.css";
import { useNavigate } from "react-router-dom";
const UserAccountPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const Navigate = useNavigate();
  
  useEffect(() => {
    // Fetch cities from new API with depth=2
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    const selectedCity = cities.find(city => String(city.name) === value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      district: "",
      ward: "",
    }));
    setDistricts(selectedCity ? selectedCity.districts : []);
    setWards([]);
    validateField(name, value);
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;
    const selectedDistrict = districts.find(district => String(district.name) === value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      ward: "",
    }));
    validateField(name, value);
  
    if (selectedDistrict) {
      // Fetch wards for selected district
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          if (data.wards && data.wards.length > 0) {
            setWards(data.wards);
          } else {
            setWards([]);
          }
        })
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        error = !emailRegex.test(value) ? "Invalid email format" : "";
        break;
      case "phone":
        const phoneRegex = /^\d{10}$/;
        error = !phoneRegex.test(value) ? "Phone number must be 10 digits" : "";
        break;
      case "password":
        error = value.trim() === "" ? "Password is required" : "";
        break;
      case "confirmPassword":
        error = value !== formData.password ? "Passwords do not match" : "";
        break;
      default:
        error = value.trim() === "" ? `${name} is required` : "";
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Perform final validation
    const { name, username, email, phone, city, district, ward, address, password, confirmPassword } = formData;
    if (
      name.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      city.trim() === "" ||
      district.trim() === "" ||
      ward.trim() === "" ||
      address.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === "" ||
      password !== confirmPassword
    ) {
      setErrors({
        name: name.trim() === "" ? "Name is required" : "",
        username: username.trim() === "" ? "Username is required" : "",
        email: email.trim() === "" ? "Email is required" : "",
        phone: phone.trim() === "" ? "Phone number is required" : "",
        city: city.trim() === "" ? "City is required" : "",
        district: district.trim() === "" ? "District is required" : "",
        ward: ward.trim() === "" ? "Ward is required" : "",
        address: address.trim() === "" ? "Address is required" : "",
        password: password.trim() === "" ? "Password is required" : "",
        confirmPassword: confirmPassword.trim() === "" ? "Confirm Password is required" : "",
      });
      return;
    }

    const fullAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
    console.log('Full Address:', fullAddress);
  
    try {
      const response = await fetch('http://26.214.87.26:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, phoneNumber: formData.phone, address: fullAddress })
      });
  
      // Check if the response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }
  
      const responseData = await response.json();
      console.log('API Response:', responseData);
  
      setRegistrationSuccess('Registration successful');
    } catch (error) {
      // console.error('Error during registration:', error);
      // setRegistrationError(error.message || 'An error occurred during registration');
      Navigate('/login');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="user-account-page">
      <form onSubmit={handleRegister}>
        <div>
          <label>
            <FaUser /> Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>
            <FaUser /> Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div>
          <label>
            <FaEnvelope /> Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>
            <FaPhone /> Phone
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>
        <div>
          <label>
            City
            <select
              name="city"
              value={formData.city}
              onChange={handleCityChange}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.code} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div>
          <label>
            District
            <select
              name="district"
              value={formData.district}
              onChange={handleDistrictChange}
              disabled={!formData.city}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </label>
          {errors.district && <p className="error">{errors.district}</p>}
        </div>
        <div>
          <label>
            Ward
            <select
              name="ward"
              value={formData.ward}
              onChange={handleWardChange}
              disabled={!formData.district}
            >
              <option value="">Select Ward</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </label>
          {errors.ward && <p className="error">{errors.ward}</p>}
        </div>
        <div>
          <label>
            <FaMapMarkerAlt /> Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
          {errors.address && <p className="error">{errors.address}</p>}
        </div>
        <div>
          <label>
            Password
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span onClick={toggleShowPassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <label>
            Confirm Password
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span onClick={toggleShowConfirmPassword}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        {registrationError && <p className="error">{registrationError}</p>}
        {registrationSuccess && <p className="success">{registrationSuccess}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UserAccountPage;