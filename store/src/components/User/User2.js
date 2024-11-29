// User2.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import "./User2.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User2 = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        toast.success("Đăng nhập thành công!", { autoClose: 3000 });

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
          localStorage.setItem('roles', JSON.stringify(roles));
          if (roles.includes('ADMIN')) {
            // Thêm thông báo trước khi điều hướng
            toast.info("Bạn đang đăng nhập với tư cách quản trị.", { autoClose: 3000 });
            // Điều hướng sau 3 giây
            setTimeout(() => {
              navigate('/admin');
            }, 3000);
          } else if (roles.includes('USER')) {
            // toast.info("Bạn đang đăng nhập với tư cách người dùng.", { autoClose: 3000 });
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            toast.error('Bạn không có quyền truy cập hệ thống.', { autoClose: 3000 });
            setTimeout(() => {
              navigate('/');
            }, 3000);
          }
        } else {
          toast.error('Không thể lấy thông tin người dùng.', { autoClose: 3000 });
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } else {
        toast.error('Đăng nhập không thành công.', { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, { autoClose: 3000 });
      } else {
        toast.error('Đã xảy ra lỗi khi đăng nhập.', { autoClose: 3000 });
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
  };

   // Mở dialog lỗi
   const handleOpenErrorDialog = (message) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  // Đóng dialog lỗi
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
    setErrorMessage("");
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = async () => {
    const { username } = formData;
    if (username.trim() === "") {
      // Thay thế toast.error bằng dialog lỗi
      handleOpenErrorDialog("Username là bắt buộc.");
      return;
    }

    try {
      const response = await axios.post('http://26.214.87.26:8080/api/users/forgot', { username });

      if (response.status === 200) {
        const { newPassword } = response.data;
        // Hiển thị mật khẩu mới trong dialog
        handleOpenErrorDialog(`Đặt lại mật khẩu thành công! Mật khẩu mới của bạn là: ${newPassword}`);
        handleCloseDialog();
      } else {
        handleOpenErrorDialog("Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      handleOpenErrorDialog("Đã xảy ra lỗi khi đặt lại mật khẩu.");
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
              Bạn có muốn đặt lại mật khẩu không? Mật khẩu mới sẽ được gửi cho bạn.
            </DialogContentText>
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

        {/* Dialog lỗi/Thông báo */}
        <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
          <DialogTitle>{errorMessage.startsWith("Đặt lại mật khẩu thành công") ? "Thành công" : "Lỗi"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default User2;