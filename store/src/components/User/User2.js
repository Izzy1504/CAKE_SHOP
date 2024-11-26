import React, { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import "./User2.css";
import { useNavigate } from "react-router-dom";
const User2 = () => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
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
      const response = await fetch("http://26.214.87.26:8080/api/auth/login", {
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

  const forgotPassword = async () => {
    try {
      const response = await fetch("http://26.214.87.26:8080/api/users/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formData.emailOrPhone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error resetting password:", errorData);
        alert("Error resetting password: " + (errorData.message || "Please try again."));
        return;
      }

      const data = await response.json();
      setNewPassword(data.newPassword);
      setOpen(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewPassword("");
  };

  useEffect(() => {
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
            <TextField
              type="text"
              name="emailOrPhone"
              label="Email or Phone Number"
              value={formData.emailOrPhone}
              onChange={handleChange}
              fullWidth
              error={!!errors.emailOrPhone}
              helperText={errors.emailOrPhone}
              variant="outlined"
            />
          </div>
          <div className="mt-4">
            <TextField
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </div>
          {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
          <div className="flex justify-between items-center">
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
            <Button variant="contained" color="secondary"  style={{ marginLeft: '20px' }} onClick={forgotPassword}>
              Forgot Password
            </Button>
          </div>
        </form>
      </div>
      <div className="falling-cakes"></div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your new password is: <strong>{newPassword}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default User2;