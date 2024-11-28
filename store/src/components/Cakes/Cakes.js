import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Cakes.module.scss';
import { StateContext } from '../../context/StateContextProvider';

const Cakes = () => {
  const [cakes, setCakes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12; // Số lượng sản phẩm mỗi trang
  const { cakeRef } = useContext(StateContext);

  const backendURL = 'http://26.214.87.26:8080';

  const fetchProducts = async (page = 0, size = pageSize) => {
    try {
      const response = await axios.get(`${backendURL}/api/products?page=${page}&size=${size}`);
      if (response.status === 200) {
        setCakes(response.data.content);
        setCurrentPage(response.data.page.number);
        setTotalPages(response.data.page.totalPages);
        // scrollToTop(); // Cuộn lên đầu trang sau khi tải dữ liệu mới
        scrollToCakes();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCakes = () => {
    window.scrollTo({ top: cakeRef.current.offsetTop - 55, behavior: 'smooth' });
  };

  return (
    <div>
      <section ref={cakeRef} id="cakes-section" className={styles.cakesMenu}>
        <div className={styles.cakesWrapper}>
          <h2>Our Cakes</h2>
          <div className={styles.dividerLine}></div>
        </div>
      </section>
      <div className={styles.listProducts}>
        {cakes.map((item) => (
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