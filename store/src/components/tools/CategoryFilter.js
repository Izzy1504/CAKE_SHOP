// src/components/tools/CategoryFilter.js
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  DialogActions,
  Button,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import axios from "axios";
import styles from "./CategoryFilter.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
  sortOrder,
  setSortOrder,
  updateProducts,
}) => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [error, setError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const backendURL = "http://26.214.87.26:8080";

 
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setError('');
      try {
        const response = await axios.get(`${backendURL}/api/products/categories`, {
          headers: {
            // Bao gồm các header cần thiết nếu có, ví dụ: Authorization
            // Authorization: `Bearer YOUR_AUTH_TOKEN`,
          },
        });
        
        // Kiểm tra xem response.data.categories có phải là mảng hay không
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          // Nếu không phải mảng, đặt categories thành mảng rỗng
          setCategories([]);
          console.error("Dữ liệu trả về không phải là mảng chuỗi:", response.data);
          setError('Dữ liệu trả về không đúng định dạng.');
        }
      } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        setError('Lỗi khi lấy danh mục.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [backendURL]);


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  
    // Hàm xử lý thay đổi danh mục
    const handleCategoryChange = (event) => {
      const { value } = event.target;
      setSelectedCategories(
        typeof value === 'string' ? value.split(',') : value,
      );
    };
  return (
    <>
      <TuneIcon onClick={handleOpen} className={styles.filterIcon} />
      <Dialog open={open} onClose={handleClose} className={styles.dialog}>
        <DialogTitle>Lọc Sản Phẩm</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            variant="outlined"
            className={styles.formControl}
            margin="normal"
          >
       <InputLabel>Loại Bánh</InputLabel>
        <Select
          multiple
          value={selectedCategories}
          onChange={handleCategoryChange}
          label="Danh mục"
          renderValue={(selected) => selected.join(', ')}
        >
          {loadingCategories ? (
            <MenuItem>
              <CircularProgress size={24} />
            </MenuItem>
          ) : (
            Array.isArray(categories) && categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                <Checkbox
                  checked={selectedCategories.indexOf(category) > -1}
                />
                <ListItemText primary={category} />
              </MenuItem>
            ))
          )}
        </Select>
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            className={styles.formControl}
            margin="normal"
          >
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sắp xếp"
            >
              <MenuItem value="">
                <em>Mặc định</em>
              </MenuItem>
              <MenuItem value="priceAsc">Giá: Thấp đến Cao</MenuItem>
              <MenuItem value="priceDesc">Giá: Cao đến Thấp</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <div className={styles.loadingOverlay}>
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default CategoryFilter;
