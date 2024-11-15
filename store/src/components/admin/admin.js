import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './admin.module.scss';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import AccountManagement from './AccountManagement';
export default function Admin() {
  const [selectedSection, setSelectedSection] = useState('home');

  return (
    <div className={styles.adminPage}>
      <nav className={styles.adminNav}>
        <ul>
          <li><Link to="/admin" onClick={() => setSelectedSection('home')}>Trang chủ</Link></li>
          <li><Link to="#" onClick={() => setSelectedSection('products')}>Quản lý sản phẩm</Link></li>
          <li><Link to="#" onClick={() => setSelectedSection('accounts')}>Quản lý tài khoản</Link></li>
          <li><Link to="#" onClick={() => setSelectedSection('orders')}>Quản lý đơn hàng</Link></li>
        </ul>
      </nav>
      <div className={styles.adminContent}>
        {selectedSection === 'home' && <div>Trang chủ</div>}
        {selectedSection === 'products' && <ProductManagement />}
        {selectedSection === 'accounts' && <AccountManagement/>}
        {selectedSection === 'orders' && <OrderManagement />}
      </div>
    </div>
  );
}