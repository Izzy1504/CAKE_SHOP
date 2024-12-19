import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './AddProduct.module.scss';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('BÁNH MÌ - BÁNH NGỌT');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setError('');
      try {
        const response = await axios.get(`${backendURL}/api/products/categories`);
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', parseFloat(price));
    formData.append('category', category);
    formData.append('quantity', parseInt(quantity)); // Append quantity to formData
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      const response = await axios.post(`${backendURL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
      });

      if (response.status === 201) {
        toast.success('Product added successfully!');
        navigate('/admin/products'); // Chuyển hướng ngay lập tức
        console.log('Product added successfully:', response.data); // Log the response data
      } else {
        toast.error('Failed to add product.');
        console.error('Failed to add product:', response.data); // Log the response data
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.addProduct}>
      <ToastContainer />
      <h2>Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên sản phẩm</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Danh mục"
            >
              {loadingCategories ? (
                <MenuItem>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </div>
        <div>
          <label>Số lượng</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hình ảnh</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
          />
          <div className={styles.imagePreviews}>
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} />
            ))}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
          >
            Back
          </button>
          <button type="submit">Thêm sản phẩm</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;