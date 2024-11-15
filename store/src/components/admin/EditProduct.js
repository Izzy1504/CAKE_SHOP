import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./EditProduct.module.scss";

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const backendURL = 'http://26.214.87.26:8080';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/products/${id}`);
        if (response.status === 200) {
          const product = response.data;
          setName(product.name);
          setPrice(product.price);
          setImage(product.image);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendURL}/api/products/${id}`, { name, price, image });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className={styles.editProduct}>
      <h2>Chỉnh sửa sản phẩm</h2>
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
          <label>Hình ảnh</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        </div>
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default EditProduct;