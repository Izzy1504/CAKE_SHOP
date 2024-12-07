// src/components/Cakes/Cakes.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Cakes.module.scss';
import { StateContext } from '../../context/StateContextProvider';
import SearchBar from '../tools/SearchBar';
import CategoryFilter from '../tools/CategoryFilter';
import CircularProgress from '@mui/material/CircularProgress';

const Cakes = () => {
  const [allCakes, setAllCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [displayedCakes, setDisplayedCakes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12; // Số lượng sản phẩm mỗi trang
  const { cakeRef } = useContext(StateContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const backendURL = 'http://26.214.87.26:8080';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hàm lấy tất cả sản phẩm từ API
  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: 0,
        size: 1000, // Giả định số lượng lớn để lấy tất cả sản phẩm
      };

      // Thêm tham số tìm kiếm
      if (searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
      }

      // Thêm tham số sắp xếp
      if (sortOrder === 'priceAsc') {
        params.sort = 'price,asc';
      } else if (sortOrder === 'priceDesc') {
        params.sort = 'price,desc';
      }

      const response = await axios.get(`${backendURL}/api/products`, { params });

      if (response.status === 200) {
        const data = response.data;
        setAllCakes(data.content);
        console.log('All products fetched successfully:', data.content);
      } else {
        setError('Không thể lấy sản phẩm.');
        console.error('Unexpected response status:', response.status);
      }
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err.response?.data || err.message);
      setError('Lỗi khi lấy sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect để lấy tất cả sản phẩm khi thay đổi tìm kiếm hoặc sắp xếp
  useEffect(() => {
    setCurrentPage(0);
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortOrder]);

  // useEffect để lọc sản phẩm dựa trên danh mục đã chọn
  useEffect(() => {
    let filtered = allCakes;

    // Lọc theo danh mục đã chọn
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(cake =>
        selectedCategories.includes(cake.category)
      );
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCakes(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(0);
  }, [selectedCategories, allCakes, searchQuery, pageSize]);

  // useEffect để xác định các sản phẩm hiển thị dựa trên trang hiện tại
  useEffect(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    setDisplayedCakes(filteredCakes.slice(start, end));
  }, [currentPage, filteredCakes, pageSize]);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      console.log(`Changing to page: ${newPage + 1}`);
    } else {
      console.warn('Attempted to navigate to invalid page:', newPage);
    }
  };

  // Hàm cuộn lên đầu trang khi chuyển trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Scrolled to top of the page.');
  };

  // Log khi selectedCategories thay đổi
  useEffect(() => {
    console.log('Selected Categories Updated:', selectedCategories);
  }, [selectedCategories]);

  return (
    <div ref={cakeRef} className={styles.cakesContainer}>
      <div className={styles.controls}>
        <div className={styles.searchFilterContainer}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      </div>
      <div className={styles.listProducts}>
        {loading ? (
          <div className={styles.loading}>
            <CircularProgress />
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : displayedCakes.length > 0 ? (
          displayedCakes.map((item) => (
            <div key={item.id} className={styles.card}>
              <Link to={`/cake-details/${item.id}`} onClick={scrollToTop}>
                <div>
                  <img className={styles.cakeImage} src={item.images[0]} alt={item.name} />
                  <p className={styles.namePriceProducts}>{item.name}</p>
                  <p className={styles.namePriceProducts}>{item.price} VND</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào được tìm thấy.</p>
        )}
      </div>

      {/* Phân trang nếu không hiển thị tất cả sản phẩm */}
      {!loading && !error && displayedCakes.length > 0 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            className={styles.paginationButton}
          >
            Đầu
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={styles.paginationButton}
          >
            Trước
          </button>
          <span className={styles.pageInfo}>
            Trang {currentPage + 1} của {totalPages}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className={styles.paginationButton}
          >
            Sau
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage + 1 >= totalPages}
            className={styles.paginationButton}
          >
            Cuối
          </button>
        </div>
      )}
    </div>
  );
};

export default Cakes;