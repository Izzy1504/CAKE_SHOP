// src/components/Cakes/Cakes.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Cakes.module.scss';
import { StateContext } from '../../context/StateContextProvider';
import SearchBar from '../tools/SearchBar';
import CategoryFilter from '../tools/CategoryFilter';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const Cakes = () => {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12; // Số lượng sản phẩm mỗi trang
  const { cakeRef } = useContext(StateContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const backendURL = 'http://26.214.87.26:8080';
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const fetchProducts = async (page = 0, size = pageSize) => {
    try {
      const response = await axios.get(`${backendURL}/api/products?page=${page}&size=${size}`);
      if (response.status === 200) {
        setCakes(response.data.content);
        setCurrentPage(response.data.page.number);
        setTotalPages(response.data.page.totalPages);
        scrollToTop(); // Cuộn lên đầu trang sau khi tải dữ liệu mới
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    applyFilters(cakes);
  }, [cakes, searchQuery, selectedCategories]);

  
  const applyFilters = (cakesList) => {
    let updatedCakes = [...cakesList];
  
    // Filter by search query
    if (searchQuery.trim() !== '') {
      updatedCakes = updatedCakes.filter((cakes) =>
        cakes.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      updatedCakes = updatedCakes.filter((cake) =>
        selectedCategories.includes(cake.category.name)
      );
    }
  
    // Update the filteredCakes state
    setFilteredCakes(updatedCakes);
  };
 
  const handlePrevious = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      fetchProducts(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      fetchProducts(newPage);
    }
  };


  return (
    <div ref={cakeRef} className={styles.cakesContainer}>
      <div className={styles.controls}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
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
    </div>
  );
};


export default Cakes;