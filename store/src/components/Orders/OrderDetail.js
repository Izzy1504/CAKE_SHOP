import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Order.css"

const Orderdetail = () => {
  const order = {
    "orderId": "18",
    "userId": "3",
    "shippingAddress": "273 An Duong Vuong, Da Nang",
    "status": "PROCESSING",
    "orderDetails": [
        {
            "productId": "292",
            "quantity": 2,
            "price": 18000.0
        },
        {
            "productId": "302",
            "quantity": 5,
            "price": 22000.0
        }
    ]
}

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

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const url = `http://26.214.87.26:8080/api/order/${id}`;
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      console.log("token: ", token);
      console.log("id: ", id);
      console.log("url: ", url);
      try {
          const response = await axios.get(url, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          });
          console.log("Dữ liệu API trả về:", response.data);
          setOrderdetail(response.data.content); // Lưu lịch sử đơn hàng vào state
      } catch (err) {
          setError("Không thể tải lịch sử đơn hàng."); // Xử lý lỗi nếu API thất bại
          console.log("Lỗi: ", err);
      }
    }
    fetchOrderDetail();
    console.log("âcsc: ", orderdetail);
  }, [id]);

  return (
    <div className='odDetail-wrapper'>
      <div className="order-detail-container">
        {/* Tiêu đề */}
        <h1 className="order-detail-title">Chi tiết đơn hàng #{order.orderId}</h1>

        {/* Thông tin giao hàng */}
        <div className="order-info">
          <h3>Thông tin giao hàng</h3>
          <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
          <p><strong>Trạng thái:</strong> <span className="status">{order.status}</span></p>
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
              {order.orderDetails.map((detail, index) => (
                <tr key={index}>
                  {/* <td>{detail.productId}</td> */}
                  <td>
                    <img
                      src={cake292.images[0]}
                      alt= "Bánh Mì Gà Nấm"
                      className="product-image"
                    />
                  </td>
                  <td>{detail.quantity}</td>
                  <td>{detail.price.toLocaleString()} VNĐ</td>
                  <td>{(detail.price * detail.quantity).toLocaleString()} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng tiền */}
        <div className="order-total">
          <h3>Tổng tiền:</h3>
          <p>
            {order.orderDetails
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()}{" "}
            VNĐ
          </p>
        </div>
      </div>
    </div>
  )
}

export default Orderdetail