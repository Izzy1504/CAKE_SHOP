import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "./User.css";

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

  useEffect(() => {
    // Fetch cities from API
    fetch("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1")
      .then((response) => response.json())
      .then((data) => setCities(data.data.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      district: "",
      ward: "",
    }));
    validateField(name, value);

    // Fetch districts based on selected city
    fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${value}&limit=-1`)
      .then((response) => response.json())
      .then((data) => setDistricts(data.data.data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ward: "",
    }));
    validateField(name, value);

    // Fetch wards based on selected district
    fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${value}&limit=-1`)
      .then((response) => response.json())
      .then((data) => setWards(data.data.data))
      .catch((error) => console.error("Error fetching wards:", error));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform final validation and submit data
    console.log("Form submitted:", formData);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="user-account-page">
      <form onSubmit={handleSubmit}>
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
                <option key={city.code} value={city.code}>
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
                <option key={district.code} value={district.code}>
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
              onChange={handleChange}
              disabled={!formData.district}
            >
              <option value="">Select Ward</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserAccountPage;