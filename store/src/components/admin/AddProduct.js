import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './AddProduct.module.scss';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState("BÁNH MÌ - BÁNH NGỌT");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();

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
        navigate('/admin/products'); // Redirect to the products page
      } else {
        toast.error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product.');
    }
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
          {/* <label>Danh mục</label> */}
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            hidden
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
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;