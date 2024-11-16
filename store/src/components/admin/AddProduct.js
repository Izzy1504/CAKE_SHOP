import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddProduct.module.scss";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      price: parseFloat(price),
      category,
      images: [imageUrl]
    };

    try {
      await axios.post(`${backendURL}/api/products`, productData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <div className={styles.addProduct}>
      <h2>Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên sản phẩm</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Giá</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Danh mục</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>URL hình ảnh</label>
          <input type="text" value={imageUrl} onChange={handleImageChange} required />
          {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
        </div>
        <button type="submit">Thêm</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;