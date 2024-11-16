import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UserDetail.css"
// import axios from 'axios';

const UserDetail = () => {
  const [user, setUser] = useState(null); // Dữ liệu từ API
  const [editedUser, setEditedUser] = useState(null); // Dữ liệu đang chỉnh sửa
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [showConfirm, setShowConfirm] = useState(false); // Hiển thị hộp thoại xác nhận
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const url = "http://26.214.87.26:8080/api/users/info";
      const token = localStorage.getItem('token'); // Thay token của bạn

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setEditedUser(response.data); // Ban đầu dữ liệu chỉnh sửa giống dữ liệu gốc
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      }
    };
    console.log(localStorage.getItem('token'));v
    fetchUser();
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

  return (
    <div className="wrapper">
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
    </div>
  );
};

export default UserDetail