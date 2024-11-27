import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AccountManagement.module.scss";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';

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
        setAccounts(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const deleteAccount = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Authentication token is missing.");
      // Optionally, redirect to login page
      return;
    }
    try {
      await axios.delete(`${backendURL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(accounts.filter(account => account.info.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);
  const resetPassword = async (email) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }
    try {
      await axios.post(`${backendURL}/api/users/forgot`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Password reset email sent.");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };
  return (
    <div className={styles.accountManagement}>
      <h2>Quản lý tài khoản</h2>
      {accounts.length === 0 ? (
        <p className={styles.noAccounts}>Chưa có tài khoản nào</p>
      ) : (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên tài khoản</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.userId}>
                  <TableCell>{account.userId}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.info.email}</TableCell>
                  <TableCell>{new Date(account.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteAccount(account.info.id)}>
                      Xóa
                    </Button>
                    <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => resetPassword(account.info.email)}
                  style={{ marginLeft: '20px' }}
                >
                  tạo lại mật khẩu
                </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default AccountManagement;