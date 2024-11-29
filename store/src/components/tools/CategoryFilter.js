// src/components/tools/CategoryFilter.js
import React, { useEffect, useState } from "react";
import {
  IconButton,
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

  const backendURL = "http://26.214.87.26:8080";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/products/categories`);
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const handleFilter = async () => {
    setLoading(true);
    const filterPayload = {
      categories: selectedCategories,
      sortOrder,
      searchQuery, // Include search query in the filter payload
    };
    console.log("Filter Payload:", filterPayload);
    try {
      const response = await axios.post(`${backendURL}/api/products/filter`, filterPayload);
      if (response.status === 200) {
        updateProducts(response.data);
        console.log("Filtered products:", response.data);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <TuneIcon onClick={handleOpen} className={styles.filterIcon} />
      <Dialog open={open} onClose={handleClose} className={styles.dialog}>
        <DialogTitle>Lọc Sản Phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchField}
          />
          <FormControl
            fullWidth
            variant="outlined"
            className={styles.formControl}
            margin="normal"
          >
            <InputLabel>Loại bánh</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleChange}
              input={<OutlinedInput label="Loại bánh" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  <Checkbox
                    checked={selectedCategories.indexOf(category.name) > -1}
                  />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
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
                <em>GAY</em>
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
          <Button onClick={handleFilter} color="primary" variant="contained">
            Lọc
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
