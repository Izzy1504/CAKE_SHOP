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

const CategoryFilter = ({
  selectedCategories,
  setSelectedCategories,
  sortOrder,
  setSortOrder,
}) => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const backendURL = "http://26.214.87.26:8080";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/categories`);
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
              onChange={(e) => setSortOrder(e.target.value)}
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryFilter;
