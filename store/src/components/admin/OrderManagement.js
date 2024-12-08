import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";
import styles from "./OrderManagement.module.scss";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
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
        const sortedOrders = response.data.content.sort((a, b) => a.orderId - b.orderId); // Sắp xếp theo orderId từ nhỏ đến lớn
        setOrders(sortedOrders); // Điều chỉnh theo cấu trúc dữ liệu trả về của API
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendURL}/api/orders/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setStatuses(response.data.status); // Truy cập vào mảng `status` bên trong đối tượng trả về
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
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
      await axios.post(
        `${backendURL}/api/orders/status`,
        { orderId: orderId, status: newStatus }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();
      toast.success('Trạng thái đơn hàng đã được cập nhật!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className={styles.orderManagement}>
      <ToastContainer />
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
                const customerName = order ? order.username : 'Unknown';
                const currentStatus = Array.isArray(statuses) && statuses.includes(order.status) ? order.status : '';

                return (
                  <TableRow key={order.orderId}>
                    <TableCell align="center" className={styles.tableBodyCell}>{order.orderId}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{customerName}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{new Date(order.createDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}> {order.orderDetails
                    .reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
                    .toLocaleString()} VND</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>{order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)}</TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>
                      <Select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      >
                        {Array.isArray(statuses) && statuses.map((status) => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="center" className={styles.tableBodyCell}>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => updateOrderStatus(order.orderId, order.status)}
                        >
                          Cập nhật
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