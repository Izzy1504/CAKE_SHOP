// src/components/Cakes/Cakes.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Cakes.module.scss';
import { StateContext } from '../../context/StateContextProvider';
import SearchBar from '../tools/SearchBar';
import CategoryFilter from '../tools/CategoryFilter';

const Cakes = () => {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12; // Số lượng sản phẩm mỗi trang
  const { cakeRef } = useContext(StateContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const backendURL = 'http://26.214.87.26:8080';

   const fetchProducts = async (page = 0, size = pageSize, fetchAll = false) => {
    try {
      let url = '';
      let sortParam = '';
      const params = {};
      // Thiết lập tham số sắp xếp
      if (sortOrder === 'priceAsc') {
        sortParam = '&sort=price,asc';
      } else if (sortOrder === 'priceDesc') {
        sortParam = '&sort=price,desc';
      }
  
      if (fetchAll) {
        url = `${backendURL}/api/products?size=10000${sortParam}`;
      } else {
        url = `${backendURL}/api/products?page=${page}&size=${size}${sortParam}`;
      }
         // Thêm danh mục đã chọn
         if (selectedCategories.length > 0) {
          params.categories = selectedCategories.join(',');
        }
      const response = await axios.get(url);
      if (response.status === 200) {
        setCakes(response.data.content);
        if (!fetchAll) {
          setCurrentPage(response.data.page.number);
          setTotalPages(response.data.page.totalPages);
        } else {
          setCurrentPage(0);
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  useEffect(() => {
    if (searchQuery.trim() !== '' || selectedCategories.length > 0) {
      // Khi có tìm kiếm hoặc lọc, lấy tất cả sản phẩm
      fetchProducts(0, pageSize, true);
    } else {
      // Ngược lại, lấy sản phẩm theo phân trang
      fetchProducts(currentPage, pageSize, false);
    }
    // eslint-disable-next-line
  }, [searchQuery, selectedCategories]);
  // useEffect cho sắp xếp
  useEffect(() => {
    // Khi `sortOrder` thay đổi, kiểm tra độ dài tìm kiếm
    if (searchQuery.length > 0) {
      fetchProducts(currentPage, pageSize, true); // Fetch tất cả sản phẩm
    } else {
      fetchProducts(currentPage, pageSize, false); // Fetch theo phân trang
    }
  }, [sortOrder, searchQuery]);
  useEffect(() => {
    applyFilters(cakes);
  }, [cakes]);
  useEffect(() => {
    setCurrentPage(0);
    fetchProducts(0, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategories, sortOrder]);
  const applyFilters = (cakesList) => {
    let updatedCakes = [...cakesList];
  
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim() !== '') {
      updatedCakes = updatedCakes.filter((cake) =>
        cake.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Lọc theo danh mục đã chọn
    if (selectedCategories.length > 0) {
      updatedCakes = updatedCakes.filter((cake) =>
        selectedCategories.includes(cake.category.name)
      );
    }
  
    setFilteredCakes(updatedCakes);
  };
  const handlePrevious = () => {
    if (currentPage > 0) {
      fetchProducts(currentPage - 1, pageSize);
    }
  };

  const handleNext = () => {
    if (currentPage + 1 < totalPages) {
      fetchProducts(currentPage + 1, pageSize);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {filteredCakes.map((item) => (
          <div key={item.id} className={styles.card}>
            <Link to={`/cake-details/${item.id}`} onClick={scrollToTop}>
              <div>
                <img className={styles.cakeImage} src={item.images} alt={item.name} />
                <p className={styles.namePriceProducts}>{item.name}</p>
                <p className={styles.namePriceProducts}>{item.price} vnđ</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Phần điều hướng phân trang */}
      {searchQuery.trim() === '' && selectedCategories.length === 0 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={handlePrevious}
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
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className={styles.paginationButton}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default Cakes;