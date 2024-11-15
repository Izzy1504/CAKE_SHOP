import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AddProduct.module.scss";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const backendURL = 'http://26.214.87.26:8080';
    const navigate = useNavigate();
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await axios.post(`${backendURL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };


  return (
    <div className={styles.addProduct}>
      <h2>Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <div>
          <label>Hình ảnh</label>
          <input type="file" onChange={handleImageChange} required />
          {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
        </div>
          <label>Tên sản phẩm</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Giá</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

export default AddProduct;