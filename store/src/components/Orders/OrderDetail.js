import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Order.css"

const Orderdetail = () => {
//   const order = {
//     "orderId": "18",
//     "userId": "3",
//     "shippingAddress": "273 An Duong Vuong, Da Nang",
//     "status": "PROCESSING",
//     "orderDetails": [
//         {
//             "productId": "292",
//             "quantity": 2,
//             "price": 18000.0
//         },
//         {
//             "productId": "302",
//             "quantity": 5,
//             "price": 22000.0
//         }
//     ]
// }

  const cake292 = {
    "id": 292,
    "name": "Bánh Mì Gà Nấm",
    "price": 18000.0,
    "category": "BÁNH MÌ - BÁNH NGỌT",
    "images": [
        "https://www.sugartown.vn/upload/sanpham/banh-mi-ga-nam01-16932064971.png"
    ]
}

  const { id } = useParams();
  const [orderdetail, setOrderdetail] = useState([]);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const url = `http://26.214.87.26:8080/api/orders/${id}`;
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      console.log(token);

      try {
          const response = await axios.get(url, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          });
          // console.log("Dữ liệu API trả về:", response.data);
          setOrderdetail(response.data); // Lưu lịch sử đơn hàng vào state
      } catch (err) {
          setError("Không thể tải lịch sử đơn hàng."); // Xử lý lỗi nếu API thất bại
          console.log("Lỗi: ", err);
      }
    }
    fetchOrderDetail();
  }, [id]);

  useEffect(() => {
    if (orderdetail) {
      console.log("Data orderdetail đã cập nhật: ", orderdetail);
    }
  }, [orderdetail]);

  useEffect(() => {
    const fetchPictures = async () => {
      const newImages = {}; // Object để lưu trữ ảnh của từng sản phẩm
      for (const item of orderdetail.orderDetails) {
        try {
          const url = `http://26.214.87.26:8080/api/products/${item.productId}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          // Giả sử API trả về hình ảnh trong response.data.images[0]
          newImages[item.productId] = response.data.images[0] || "https://via.placeholder.com/50";
        } catch (error) {
          console.error(`Lỗi khi lấy hình ảnh cho sản phẩm ${item.productId}:`, error);
          newImages[item.productId] = "https://via.placeholder.com/50"; // Ảnh mặc định nếu lỗi
        }
      }
      setImages(newImages);
    };
  
    if (orderdetail.orderDetails) {
      fetchPictures();
    }
  }, [orderdetail.orderDetails]);
  
  

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderdetail) {
    return <div>Đang tải dữ liệu...</div>;
  }



  return (
    console.log(images),
    <div className='odDetail-wrapper'>
      <div className="order-detail-container">
        {/* Tiêu đề */}
        <h1 className="order-detail-title">Chi tiết đơn hàng #{orderdetail.orderId}</h1>

        {/* Thông tin giao hàng */}
        <div className="order-info">
          <h3>Thông tin giao hàng</h3>
          <p><strong>Địa chỉ:</strong> {orderdetail.shippingAddress}</p>
          <p><strong>Trạng thái:</strong> <span className="status">{orderdetail.status}</span></p>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="product-detail">
          <h3>Chi tiết sản phẩm</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Hình sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá (1 cái)</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderdetail.orderDetails && orderdetail.orderDetails.length > 0 ? (
                orderdetail.orderDetails.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        src= {images[item.productId]}
                        alt="Product"
                        width="50"
                      />
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()} VNĐ</td>
                    <td>{(item.quantity * item.price).toLocaleString()} VNĐ</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Không có sản phẩm trong đơn hàng.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tổng tiền */}
        <div className="order-total">
          <h3>Tổng tiền:</h3>
          <p>
            {orderdetail?.orderDetails && Array.isArray(orderdetail.orderDetails)
            ? orderdetail.orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()
            : "0 VNĐ"}
            VNĐ
          </p>
        </div>
      </div>
    </div>
  )
}

export default Orderdetail