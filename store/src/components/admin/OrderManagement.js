import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import axios from "axios";
import styles from "./OrderManagement.module.scss";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendURL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setOrders(response.data.content); // Điều chỉnh theo cấu trúc dữ liệu trả về của API
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendURL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setCustomers(response.data.content); // Điều chỉnh theo cấu trúc dữ liệu trả về của API
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendURL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(orders.filter(order => order.orderId !== id)); // Điều chỉnh theo khóa chính của đơn hàng
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${backendURL}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  return (
    <div className={styles.orderManagement}>
      <h2>Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <p className={styles.noOrders}>Tài khoản chưa có đơn hàng nào</p>
      ) : (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className={styles.tableHeaderCell}>ID</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Tên khách hàng</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Ngày đặt hàng</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Tổng giá</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Số lượng</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Trạng thái</TableCell>
                <TableCell align="center" className={styles.tableHeaderCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const customer = customers.find(c => c.id === order.customerId);
                const customerName = order ? order.username : 'Unknown';

                return (
                  <TableRow key={order.orderId}>
                    <TableCell align="center" className={styles.tableBodyCell}>{order.orderId}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{customerName}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{new Date(order.createDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}> {order.orderDetails
                    .reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
                    .toLocaleString()} VND</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{order.status}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => updateOrderStatus(order.orderId, 'Processed')}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => deleteOrder(order.orderId)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default OrderManagement;