import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'swiper/swiper.css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
import styles from './Cakes.module.scss';

// Cài đặt các module Swiper cần thiết
SwiperCore.use([Autoplay, Pagination, Navigation]);

const CakesSlide = () => {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendURL = 'http://26.214.87.26:8080'; // Thay bằng URL backend của bạn

    const fetchCakes = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/products`);
            // Kiểm tra cấu trúc dữ liệu trả về từ API
            if (response.data && response.data.content) {
                setCakes(response.data.content);
                console.log('Fetched cakes:', response.data.content);
            } else {
                setError('Dữ liệu bánh không hợp lệ.');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cakes:', err);
            setError('Không thể tải dữ liệu bánh.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCakes();
    }, []);

    const formatPrice = (price) => {
        return price ? price.toFixed(2) : 'N/A'; // Đảm bảo price tồn tại
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className={styles.cakesSlideSection}>
            <div className={styles.cakesSlideWrapper}>
                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : cakes.length === 0 ? (
                    <p className={styles.noCakes}>Không có sản phẩm nào.</p>
                ) : (
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={3}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        navigation
                        style={{ position: "relative" }}
                        breakpoints={{
                            // Responsive breakpoints
                            320: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 30 },
                        }}
                    >
                        {cakes.map((cake) => (
                            <SwiperSlide key={cake.id}>
                                <Link to={`/cake-details/${cake.id}`} className={styles.cardLink}>
                                    <div className={styles.card} onClick={scrollToTop}>
                                        <img
                                            className={styles.cakeImage}
                                            src={cake.images && cake.images.length > 0 ? cake.images[0] : '/default-cake.jpg'}
                                            alt={cake.name || 'Cake'}
                                        />
                                        <div className={styles.cakeDetails}>
                                            <p className={styles.cakeName}>{cake.name || 'Tên bánh'}</p>
                                            <p className={styles.cakePrice}>
                                                {cake.price ? formatPrice(cake.price) : 'N/A'} vnđ
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
};

export default CakesSlide;