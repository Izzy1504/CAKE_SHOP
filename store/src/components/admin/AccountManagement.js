import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AccountManagement.module.scss";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/users/info`);
      if (response.status === 200) {
        setAccounts(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const deleteAccount = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/accounts/${id}`);
      setAccounts(accounts.filter(account => account.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteAccount(account.id)}>
                      Xóa
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