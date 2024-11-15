import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';
import styles from './home.module.scss';

const Home = ({ adminName, handleLogout }) => {
  const [adminStatus, setAdminStatus] = useState('active');
  const backendURL = 'http://26.214.87.26:8080';

  useEffect(() => {
    // Giả sử bạn có một API để lấy trạng thái admin
    axios.get(`${backendURL}/api/admin/status`)
      .then(response => {
        setAdminStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error fetching admin status:', error);
      });
  }, []);

  return (
    <div className={styles.home}>
      <h2>Thông tin Admin</h2>
      <table className={styles.adminTable}>
        <tbody>
          <tr>
            <td>Tên Admin:</td>
            <td>{adminName}</td>
          </tr>
          <tr>
            <td>Trạng thái:</td>
            <td>{adminStatus}</td>
          </tr>
          <tr>
            <td colSpan="2">
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FaSignOutAlt /> Đăng xuất
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Home;