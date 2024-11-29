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
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState("");

  
  useEffect(() => {
    // Fetch cities from new API with depth=2
    fetch("https://provinces.open-api.vn/api/?depth=2")
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleCityChange = (e) => {
    const { name, value } = e.target;
    const selectedCity = cities.find(city => String(city.code) === value);
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
    const selectedDistrict = districts.find(district => String(district.code) === value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      ward: "",
    }));
    validateField(name, value);

    if (selectedDistrict) {
      // Fetch wards for selected district
      fetch(`https://provinces.open-api.vn/api/d/${value}?depth=2`)
        .then((response) => response.json())
        .then((data) => {
          setWards(data.wards);
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

    try {
      // Combine address fields
      const fullAddress = `${address}, ${wardName}, ${districtName}, ${cityName}`;

      // Send registration request to server
      const response = await fetch("http://26.214.87.26:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, phoneNumber: phone, address: fullAddress, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration Error:", errorData);
        if (errorData.status === 400) {
          setRegistrationError("Validation error: " + errorData.description);
        } else if (errorData.status === 500) {
          setRegistrationError("Server error: " + errorData.description);
        } else {
          setRegistrationError(errorData.message || "Registration failed");
        }
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setRegistrationSuccess("Registration successful! Please log in.");
      setFormData({
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
    } catch (error) {
      console.error("Error:", error);
      setRegistrationError("An unknown error occurred");
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
              onChange={handleWardChange}
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
        {registrationError && <p className="error">{registrationError}</p>}
        {registrationSuccess && <p className="success">{registrationSuccess}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UserAccountPage;