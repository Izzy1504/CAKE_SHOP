import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./User2.css";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

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
      case "emailOrPhone":
        error = value.trim() === "" ? "Email or Phone Number is required" : "";
        break;
      case "password":
        error = value.trim() === "" ? "Password is required" : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Sanitize and validate inputs
    const { emailOrPhone, password } = formData;
    if (emailOrPhone.trim() === "" || password.trim() === "") {
      setErrors({
        emailOrPhone: emailOrPhone.trim() === "" ? "Email or Phone Number is required" : "",
        password: password.trim() === "" ? "Password is required" : "",
      });
      return;
    }

    try {
      // Log the data being sent
      console.log("Sending data:", { username: emailOrPhone, password });

      // Send login request to server
      const response = await fetch("http://26.170.181.245:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
        },
        body: JSON.stringify({ username: emailOrPhone, password }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          console.error("Bad Request:", errorData);
          throw new Error("Bad Request: " + (errorData.message || "Invalid input"));
        } else if (response.status === 401) {
          setLoginError("Invalid username or password");
          return;
        } else if (response.status === 403) {
          throw new Error("Access denied: Invalid token type or token expired");
        } else {
          throw new Error("An unknown error occurred");
        }
      }

      const data = await response.json();
      console.log("Login successful:", data);
      // Store the token (e.g., in localStorage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("token_type", data.token_type);
      localStorage.setItem("username", emailOrPhone);
      // Reload the page to update the navbar and then navigate to the home page
      window.location.href = '/';
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
    }
  };

  useEffect(() => {
    // Create falling cakes
    const fallingCakesContainer = document.querySelector('.falling-cakes');
    for (let i = 0; i < 20; i++) {
      const cake = document.createElement('div');
      cake.classList.add('cake');
      cake.style.left = `${Math.random() * 100}vw`;
      cake.style.animationDuration = `${Math.random() * 3 + 2}s`;
      fallingCakesContainer.appendChild(cake);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
        <form id="loginForm" className="space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Email or Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.emailOrPhone}
              onChange={handleChange}
            />
            {errors.emailOrPhone && <p className="mt-2 text-sm text-red-600">{errors.emailOrPhone}</p>}
          </div>
          <div className="mt-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="falling-cakes"></div>
    </div>
  );
};

export default Login;