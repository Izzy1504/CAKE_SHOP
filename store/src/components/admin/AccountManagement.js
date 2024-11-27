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
        console.log("Fetched accounts:", response.data.content); // Debugging line
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
      setAccounts(accounts.filter(account => account.userId !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const resetPassword = async (email) => {
    const token = localStorage.getItem('token');
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
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
                  <TableCell>
                    {account.info && account.info.email ? account.info.email : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {account.createdDate ? new Date(account.createdDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => deleteAccount(account.userId)}
                    >
                      Xóa
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => resetPassword(account.info?.email)}
                      style={{ marginLeft: '10px' }}
                      disabled={!account.info?.email} // Disable if email is not available
                    >
                      Reset Password
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