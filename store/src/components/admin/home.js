import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';
import styles from './home.module.scss';

const Home = ({ handleLogout }) => {
  const [adminInfo, setAdminInfo] = useState({});
  const backendURL = 'http://26.214.87.26:8080';

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/api/users/info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminInfo(response.data);
      } catch (error) {
        console.error('Error fetching admin information:', error);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div className={styles.home}>
      <h2>Thông tin Admin</h2>
      <table className={styles.adminTable}>
        <tbody>
          <tr>
            <td>Tên Admin:</td>
            <td>{adminInfo.name}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{adminInfo.email}</td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td>{adminInfo.phoneNumber}</td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{adminInfo.address}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleLogout} style={{ fontSize: '1.2em' }}>
        Đăng xuất <FaSignOutAlt />
      </button>
    </div>
  );
};

export default Home;