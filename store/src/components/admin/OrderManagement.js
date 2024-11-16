import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrderManagement.module.scss";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/orders`);
      if (response.status === 200) {
        setOrders(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
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
                <TableCell>ID</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Ngày đặt hàng</TableCell>
                <TableCell>Tổng giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteOrder(order.id)}>
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

export default OrderManagement;