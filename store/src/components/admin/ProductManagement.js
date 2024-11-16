import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateContextProvider";
import styles from "./ProductManagement.module.scss";
import axios from "axios";

const ProductManagement = () => {
  const { formatPrice } = useStateContext();
  const [cakes, setCakes] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/products`);
      if (response.status === 200) {
        setCakes(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/products/${id}`);
      setCakes(cakes.filter(cake => cake.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.productManagement}>
      <h2>Quản lý sản phẩm</h2>
      <Button variant="contained" color="primary" onClick={() => navigate('/admin/add-product')}>
        Thêm sản phẩm
      </Button>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cakes.map((cake) => (
              <TableRow key={cake.id}>
                <TableCell>
                  <img src={cake.images} alt={cake.name} className={styles.productImage} />
                </TableCell>
                <TableCell>{cake.name}</TableCell>
                <TableCell>{cake.quantity}</TableCell>
                <TableCell>{formatPrice(cake.price)}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" className={styles.actionButton} onClick={() => deleteProduct(cake.id)}>
                    Xóa
                  </Button>
                  <Button variant="contained" color="primary" className={styles.actionButton} onClick={() => navigate(`/admin/edit-product/${cake.id}`)}>
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProductManagement;