import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./EditProduct.module.scss";

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [initialProduct, setInitialProduct] = useState({});
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
          setCategory(product.category);
          setImage(product.images[0]);
          setImagePreview(product.images[0]);
          setInitialProduct(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImage(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFields = {
      name: initialProduct.name,
      price: initialProduct.price,
      category: initialProduct.category,
      images: initialProduct.images
    };

    if (name !== initialProduct.name) updatedFields.name = name;
    if (price !== initialProduct.price) updatedFields.price = parseFloat(price);
    if (category !== initialProduct.category) updatedFields.category = category;
    if (image !== initialProduct.images[0]) updatedFields.images = [image];

    console.log("Updated fields:", updatedFields); // Thêm console.log để kiểm tra dữ liệu gửi đi

    try {
      await axios.put(`${backendURL}/api/products/${id}`, updatedFields, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      toast.error("Cập nhật sản phẩm thất bại!");
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
          <label>Danh mục</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>URL hình ảnh</label>
          <input type="text" value={image} onChange={handleImageChange} required />
          {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
        </div>
        <button type="submit">Cập nhật</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProduct;