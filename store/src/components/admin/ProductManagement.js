import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/StateContextProvider";
import styles from "./ProductManagement.module.scss";
import axios from "axios";

const ProductManagement = () => {
  const { formatPrice } = useStateContext();
  const [cakes, setCakes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Số lượng sản phẩm mỗi trang
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (page = 0, size = pageSize) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    try {
      const response = await axios.get(`${backendURL}/api/products?page=${page}&size=${size}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
      });
      if (response.status === 200) {
        setCakes(response.data.content);
        setCurrentPage(response.data.page.number);
        setTotalPages(response.data.page.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    try {
      await axios.delete(`${backendURL}/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
      });
      setCakes(prevCakes => {
        const updatedCakes = prevCakes.map(cake => 
          cake.id === id ? { ...cake, quantity: 0 } : cake
        );
        return updatedCakes.sort((a, b) => a.quantity === 0 ? 1 : -1);
      });
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      fetchProducts(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      fetchProducts(newPage);
    }
  };

  return (
    <div className={styles.productManagement}>
      <h2>Quản lý sản phẩm</h2>
      <Button variant="contained" color="primary" onClick={() => navigate('/admin/add-product')}>
        Thêm sản phẩm
      </Button>
      {location.pathname !== '/admin' && (
        <Button variant="contained" color="secondary" onClick={() => navigate('/admin')} style={{ marginLeft: '10px' }}>
          Back
        </Button>
      )}
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
            {cakes.map(cake => (
              <TableRow key={cake.id} className={cake.quantity === 0 ? styles.hiddenRow : ''}>
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

      {/* Phần điều hướng phân trang */}
      <div className={styles.pagination}>
        <button 
          type="button"
          onClick={handlePrevious} 
          disabled={currentPage === 0}
          className={styles.paginationButton}
        >
          Trước
        </button>
        <span className={styles.pageInfo}>
          Trang {currentPage + 1} của {totalPages}
        </span>
        <button 
          type="button"
          onClick={handleNext} 
          disabled={currentPage >= totalPages - 1}
          className={styles.paginationButton}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;