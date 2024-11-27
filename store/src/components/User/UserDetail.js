import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./UserDetail.css"
// import axios from 'axios';

const UserDetail = () => {
  const [user, setUser] = useState(null); // Dữ liệu từ API
  const [editedUser, setEditedUser] = useState(null); // Dữ liệu đang chỉnh sửa
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [showConfirm, setShowConfirm] = useState(false); // Hiển thị hộp thoại xác nhận
  const [orders, setOrders] = useState([]); // Dữ liệu lịch sử đơn hàng
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const url = "http://26.214.87.26:8080/api/users/info";
      const token = localStorage.getItem('token'); // Thay token của bạn

  //     try {
  //       const response = await axios.get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setUser(response.data);
  //       setEditedUser(response.data); // Ban đầu dữ liệu chỉnh sửa giống dữ liệu gốc
  //     } catch (err) {
  //       setError("Không thể tải thông tin người dùng.");
  //     }
  //   };

  //   const fetchOrderHistory = async () => {
  //     const url = "http://26.214.87.26:8080/api/orders";
  //     const token = localStorage.getItem("token"); // Lấy token từ localStorage

  //     try {
  //       const response = await axios.get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log("Dữ liệu API trả về:", response.data);
  //       setOrders(response.data.content); // Lưu lịch sử đơn hàng vào state
  //     } catch (err) {
  //       setError("Không thể tải lịch sử đơn hàng."); // Xử lý lỗi nếu API thất bại
  //     }
  //   };
  //   fetchUser();
  //   fetchOrderHistory();
  //   console.log(localStorage.getItem('token'));
  //   // console.log("url: ", url);
  //   console.log("âcsc: ", orders);
  // }, []);
  //.................................................................................................................
  // code này t chỉnh lại để show thông tin vì API thay đổi
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const userData = response.data;
      setUser({
        name: userData.info?.name || '',
        email: userData.info?.email || '',
        address: userData.info?.address || '',
        phoneNumber: userData.info?.phoneNumber || '',
      });
      setEditedUser({
        name: userData.info?.name || '',
        email: userData.info?.email || '',
        address: userData.info?.address || '',
        phoneNumber: userData.info?.phoneNumber || '',
      });
    } else {
      setError("Lỗi fetch user.");
    }
  } catch (err) {
    console.error("Lỗi vô cùng lỗi:", err);
    setError("Lỗi fetch nha ae.");
  }
  
};
  
    const fetchOrderHistory = async () => {
      const url = "http://26.214.87.26:8080/api/orders";
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Sắp xếp mảng content theo thứ tự tăng dần của orderId
        const sortedData = response.data.content.sort(
          (a, b) => parseInt(a.orderId) - parseInt(b.orderId)
        );
        console.log("Dữ liệu API trả về, được sort:", sortedData);
        setOrders(sortedData); // Lưu lịch sử đơn hàng vào state
      } catch (err) {
        setError("Không thể tải lịch sử đơn hàng."); // Xử lý lỗi nếu API thất bại
      }
    };
fetchUser();
fetchOrderHistory();
}, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    const url = "http://26.214.87.26:8080/api/users/update"; // Thay đổi URL API nếu cần
    const token = "YOUR_BEARER_TOKEN";

    try {
      await axios.put(
        url,
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(editedUser); // Cập nhật lại thông tin gốc
      setIsEditing(false);
      setShowConfirm(false);
    } catch (err) {
      setError("Không thể lưu thông tin.");
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div className="loading">Đang tải...</div>;
  }

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`); // Chuyển đến trang chi tiết đơn hàng
  };

  return (
    // console.log("orders: ", orders),
    <div className="wrapper">
      {/* Thông tin người dùng */}
      <div className="user-detail-wrapper">
        <h1>Thông tin người dùng</h1>
        <div className="user-card">
          {isEditing ? (
            <>
              <p>
                <strong>Tên:</strong>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                />
              </p>
              <p>
                <strong>Địa chỉ:</strong>
                <input
                  type="text"
                  name="address"
                  value={editedUser.address}
                  onChange={handleInputChange}
                />
              </p>
              <p>
                <strong>Email:</strong>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                />
              </p>
              <p>
                <strong>Số điện thoại:</strong>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedUser.phoneNumber}
                  onChange={handleInputChange}
                />
              </p>
            </>
          ) : (
            <>
              <p><strong>Tên:</strong> {user.name}</p>
              <p><strong>Địa chỉ:</strong> {user.address}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
            </>
          )}
        </div>

        <div className="buttons">
          {isEditing ? (
            <>
              <button className="btn save" onClick={() => setShowConfirm(true)}>
                Lưu
              </button>
              <button className="btn cancel" onClick={() => setIsEditing(false)}>
                Hủy
              </button>
            </>
          ) : (
            <button className="btn edit" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </button>
          )}
        </div>

        {showConfirm && (
          <div className="confirm-modal">
            <div className="modal-content">
              <h3>Xác nhận lưu thông tin</h3>
              <p>Bạn có chắc chắn muốn lưu các thay đổi?</p>
              <div className="modal-buttons">
                {/* <button className="btn save" onClick={handleSave}> */}
                <button className="btn save">
                  Đồng ý
                </button>
                <button
                  className="btn cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lịch sử đơn hàng */}
      <div className="user-order-wrapper">
        <h1>Lịch sử đơn hàng</h1>
        <div className="order-table">
          {/* Tiêu đề của bảng */}
          <div className="order-header">
            <span>Mã đơn hàng</span>
            <span>Trạng thái</span>
            <span>Số lượng sản phẩm</span>
            <span>Giá tiền</span>
          </div>
          {/* Dữ liệu của từng đơn hàng */}
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                className="order-card"
                key={order.orderId}
                onClick={() => handleOrderClick(order.orderId)} // Nếu cần chuyển đến trang chi tiết
              >
                <span>#{order.orderId}</span>
                <span>{order.status}</span>
                <span>
                  {order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)} {/* Tổng số lượng sản phẩm */}
                </span>
                <span>
                  {order.orderDetails
                    .reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </span>
              </div>
            ))
          ) : (
            <p>Không có lịch sử đơn hàng.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail