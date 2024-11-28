// User2.js
import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import "./User2.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const User2 = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();

    // Sanitize và validate inputs
    const { username, password } = formData;
    let tempErrors = {};
    if (username.trim() === "") {
      tempErrors.username = "Username là bắt buộc";
    }
    if (password.trim() === "") {
      tempErrors.password = "Mật khẩu là bắt buộc";
    }

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length > 0) {
      return;
    }

    try {
      // Gửi yêu cầu đăng nhập
      const loginResponse = await axios.post('http://26.214.87.26:8080/api/auth/login', {
        username,
        password
      });

      if (loginResponse.status === 200) {
        const { token } = loginResponse.data;
        localStorage.setItem("token", token);
        toast.success("Đăng nhập thành công!");

        // Lấy thông tin người dùng để xác định vai trò
        const userInfoResponse = await axios.get('http://26.214.87.26:8080/api/users/info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userInfoResponse.status === 200) {
          const userInfo = userInfoResponse.data;
          const roles = userInfo.roles || '';

          // Lưu username vào localStorage
          localStorage.setItem('username', userInfo.username || '');

          if (roles.includes('ADMIN')) {
            // Thêm thông báo trước khi điều hướng
            toast.info("Bạn đang đăng nhập với tư cách quản trị.");
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
          } else if (roles.includes('USER')) {
            navigate('/');
          } else {
            toast.error('Bạn không có quyền truy cập hệ thống.');
            navigate('/');
          }
        } else {
          toast.error('Không thể lấy thông tin người dùng.');
        }
      } else {
        toast.error('Đăng nhập không thành công.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập.');
      }
    }
  };

  // Mở dialog đặt lại mật khẩu
  const handleOpenDialog = () => {
    setOpen(true);
  };

  // Đóng dialog đặt lại mật khẩu
  const handleCloseDialog = () => {
    setOpen(false);
    setNewPassword("");
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (newPassword.trim() === "") {
      toast.error("Mật khẩu mới không được để trống.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://26.214.87.26:8080/api/auth/reset-password', { newPassword }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success("Đặt lại mật khẩu thành công!");
        handleCloseDialog();
      } else {
        toast.error("Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
        <form id="loginForm" className="space-y-6" onSubmit={handleLogin}>
          <div>
            <TextField
              type="text"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              error={!!errors.username}
              helperText={errors.username}
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
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="contained" color="primary">
              Đăng nhập
            </Button>
            <Button variant="text" color="secondary" onClick={handleOpenDialog}>
              Đặt lại mật khẩu
            </Button>
          </div>
        </form>
        
        {/* Dialog đặt lại mật khẩu */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Vui lòng nhập mật khẩu mới của bạn.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleResetPassword} color="primary">
              Đặt lại
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default User2;