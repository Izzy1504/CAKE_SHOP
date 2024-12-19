import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EditProduct.module.scss";

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [initialProduct, setInitialProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      try {
        const response = await axios.get(`${backendURL}/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request headers
          }
        });
        if (response.status === 200) {
          const product = response.data;
          setName(product.name);
          setPrice(product.price);
          setCategory(product.category);
          setInitialProduct(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("An error occurred while fetching the product.");
      }
    };

    fetchProduct();
  }, [id, backendURL]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/products/categories`);
        if (response.status === 200) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [backendURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', parseFloat(price));
    formData.append('category', category);

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      const response = await axios.put(`${backendURL}/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
      });

      if (response.status === 200) {
        toast.success('Product updated successfully!', {
          onClose: () => navigate('/admin/products') // Navigate to product management page after the toast is closed
        });
        console.log('Product updated successfully:', response.data); // Log the response data
      } else {
        toast.error('Failed to update product.');
        console.error('Failed to update product:', response.data); // Log the response data
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product.');
    }
  };

  return (
    <div className={styles.editProduct}>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className={styles.category}>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => navigate('/admin/products')}>Back</button>
          <button type="submit">Update Product</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;