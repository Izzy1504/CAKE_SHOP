import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@mui/material";
import axios from "axios";
import styles from "./AccountManagement.module.scss";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordHistoryDialogOpen, setPasswordHistoryDialogOpen] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [localPasswordHistory, setLocalPasswordHistory] = useState(JSON.parse(localStorage.getItem('passwordHistory')) || {});
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const backendURL = 'http://26.214.87.26:8080';
// hisory review password

  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Authentication token is missing.");
      // Optionally, redirect to login page
      return;
    }
    try {
      const response = await axios.get(`${backendURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("Fetched accounts:", response.data.content); // Debugging line
        setAccounts(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const deleteAccount = async (username) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Authentication token is missing.");
      // Optionally, redirect to login page
      return;
    }
    console.log("Deleting account with username:", username); // Debugging line
    try {
      await axios.delete(`${backendURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          username: username, // Thêm username vào payload
        },
      });
      setAccounts(accounts.filter(account => account.username !== username));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  const handleOpenSuccessDialog = (message) => {
    // Implement your success dialog logic here
    console.log("Success:", message);
  };
  
  const handleOpenPasswordDialog = (password) => {
    setNewPassword(password);
    setPasswordDialogOpen(true);
  };

  const savePasswordHistoryToLocalStorage = (history) => {
    localStorage.setItem('passwordHistory', JSON.stringify(history));
  };

  const resetPassword = async (username) => {
    if (!username || username.trim() === "") {
      // Thay thế toast.error bằng dialog lỗi
      handleOpenErrorDialog("Username là bắt buộc.");
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/api/users/forgot`, { username });

      if (response.status === 200) {
        const { newPassword } = response.data;
        // Hiển thị mật khẩu mới trong dialog
        handleOpenSuccessDialog(`Đặt lại mật khẩu thành công! Mật khẩu mới của bạn là: ${newPassword}`);
        handleCloseDialog();

        // Lưu mật khẩu mới vào lịch sử mật khẩu
        const updatedHistory = {
          ...localPasswordHistory,
          [username]: [...(localPasswordHistory[username] || []), { username, password: newPassword }]
        };
        setLocalPasswordHistory(updatedHistory);
        savePasswordHistoryToLocalStorage(updatedHistory);

        // Hiển thị mật khẩu mới trong dialog
        handleOpenPasswordDialog(newPassword);
      } else {
        handleOpenErrorDialog("Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      handleOpenErrorDialog("Đã xảy ra lỗi khi đặt lại mật khẩu.");
    }
  };

  const fetchPasswordHistory = (username) => {
    if (localPasswordHistory[username]) {
      setPasswordHistory(localPasswordHistory[username]);
      setPasswordHistoryDialogOpen(true);
    } else {
      console.error("No password history found for this user.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpenErrorDialog = (message) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <div className={styles.accountManagement}>
      <h2>Quản lý tài khoản</h2>
      {accounts.length === 0 ? (
        <p className={styles.noAccounts}>Không có tài khoản nào</p>
      ) : (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.tableHeaderCell}>ID</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Tên tài khoản</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Email</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Ngày tạo</TableCell>
                <TableCell  >Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.username}>
                  <TableCell align="center" className={styles.tableBodyCell}>{account.userId}</TableCell>
                  <TableCell align="center" className={styles.tableBodyCell}>{account.username}</TableCell>
                  <TableCell align="center" className={styles.tableBodyCell}>
                    {account.info && account.info.email ? account.info.email : 'N/A'}
                  </TableCell>
                  <TableCell align="center" className={styles.tableBodyCell}>
                    {account.createdDate ? new Date(account.createdDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="center" className={styles.tableBodyCell}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => resetPassword(account.username)}
                      >
                        Reset Pass
                      </Button> */}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => deleteAccount(account.username)}
                      >
                        Delete
                      </Button>
                      {/* <Button
                        variant="contained"
                        onClick={() => fetchPasswordHistory(account.username)}
                      >
                        View History
                      </Button> */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Dialog lỗi */}
      {errorDialogOpen && (
        <Dialog open={errorDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Lỗi</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Dialog lịch sử mật khẩu */}
      {passwordHistoryDialogOpen && (
        <Dialog open={passwordHistoryDialogOpen} onClose={() => setPasswordHistoryDialogOpen(false)}>
          <DialogTitle>Lịch sử mật khẩu thay đổi bởi admin</DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {passwordHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.username}</TableCell>
                    <TableCell>{entry.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordHistoryDialogOpen(false)} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Dialog mật khẩu mới */}
      {passwordDialogOpen && (
        <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
          <DialogTitle>Mật khẩu mới</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Mật khẩu mới của bạn là: {newPassword}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AccountManagement;