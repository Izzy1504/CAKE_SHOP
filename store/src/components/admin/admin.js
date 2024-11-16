import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaCog } from 'react-icons/fa';
import styles from './admin.module.scss';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import AccountManagement from './AccountManagement';
import Home from './home';
import axios from 'axios';

export default function Admin() {
  const [selectedSection, setSelectedSection] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Kiểm tra trạng thái đăng nhập
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     // Giả sử bạn có một API để lấy thông tin admin từ token
  //     axios.get('http://26.214.87.26:8080/api/admin/info', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     .then(response => {
  //       setAdminName(response.data.name);
  //       setIsLoggedIn(true);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching admin info:', error);
  //       navigate('/login');
  //     });
  //   } else {
  //     navigate('/login');
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className={styles.adminPage}>
      <nav className={styles.adminNav}>
        <div className={styles.adminProfile}>
          <img src="https://th.bing.com/th/id/OIP.PKSjC6wcZ9pR_-nQ6WGJ4QHaHe?w=197&h=199&c=7&r=0&o=5&pid=1.7" alt="Admin Avatar" />
          <div className={styles.adminName}>{adminName}</div>
        </div>
        <ul className={styles.navLinks}>
          <li><Link to="/admin" onClick={() => setSelectedSection('home')}>Trang chủ</Link></li>
          <li><Link to="#" onClick={() => setSelectedSection('products')}>Quản lý sản phẩm</Link></li>
          <li><Link to="#" onClick={() => setSelectedSection('accounts')}>Quản lý tài khoản</Link></li>
          <li><Link to="#" onClick={() => setSelectedSection('orders')}>Quản lý đơn hàng</Link></li>
        </ul>
        {isLoggedIn && (
          <div className={styles.authIcons}>
            <button onClick={handleLogout}><FaSignOutAlt /> Đăng xuất</button>
            <Link to="/admin/update-account"><FaCog /> Cập nhật tài khoản</Link>
          </div>
        )}
      </nav>
      <div className={styles.adminContent}>
        {selectedSection === 'home' && <Home adminName={adminName} handleLogout={handleLogout} />}
        {selectedSection === 'products' && <ProductManagement />}
        {selectedSection === 'accounts' && <AccountManagement />}
        {selectedSection === 'orders' && <OrderManagement />}
      </div>
    </div>
  );
}