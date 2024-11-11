import styles from './Cakes.module.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CakesSlide from './CakesSlide';
import { useStateContext } from '../../context/StateContextProvider';

const CakeDetails = () => {
  const { quantity, increaseQty, decreaseQty, formatPrice, onAddClick, handleCartClick } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [cakeImage, setCakeImage] = useState(0);
  const [cakeDetails, setCakeDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCakeDetails = async () => {
      try {
        const response = await axios.get(`http://26.170.181.245:8080/api/products/${id}`);
        if (response.status === 200) {
          console.log("Cake details:", response.data); // Ghi log dữ liệu trả về từ API
          setCakeDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching cake details:", error);
      }
    };

    fetchCakeDetails();
  }, [id]);

  const handleClickImage = (index) => {
    setCakeImage(index);
  };

  const handleBuyNow = (e) => {
    console.log("Buy Now clicked");
    console.log("Cake details:", cakeDetails);
    onAddClick(cakeDetails, e.target.innerText);
    handleCartClick(); // Hiển thị thanh giỏ hàng
    navigate('/PaymentPage', { state: { cartItems: [cakeDetails], totalPrice: cakeDetails.price * quantity } });
  };

  return (
    <>
      <div className={styles.cakeDetailsPage}>
        <button className={styles.goBackBtn} onClick={() => navigate(-1)}>Go Back</button>
        {cakeDetails && cakeDetails.images && Array.isArray(cakeDetails.images) && (
          <div className={styles.cakeDetailed}>
            <div>
              <div className={styles.cakeDetailsImage}>
                <img id={cakeImage} src={cakeDetails.images[cakeImage]} alt={`Reference photos for ${cakeDetails.name}`} />
              </div>
              <div className={styles.cakeImageReferences}>
                {cakeDetails.images.map((image, index) => (
                  <img
                    key={index}
                    className={cakeImage === index ? styles.activeImage : undefined}
                    src={image}
                    alt={`Reference ${index + 1}`}
                    onClick={() => handleClickImage(index)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2>{cakeDetails.name}</h2>
              <p>{formatPrice(cakeDetails.price)} vnđ</p>
              <div className={styles.quantityCount}>
                <span>Qty: </span>
                <div className={styles.quantity}>
                  <i className="fa-solid fa-minus fa-xs" onClick={decreaseQty}></i>
                  <span>{quantity}</span>
                  <i className="fa-solid fa-plus fa-xs" onClick={increaseQty}></i>
                </div>
              </div>
              <button className={styles.addToCart} onClick={(e) => { onAddClick(cakeDetails, e.target.innerText); handleCartClick(); }}>Add to Cart</button>
              <button className={styles.buyNow} onClick={handleBuyNow}>Buy Now</button>
              <h3>Details</h3>
              <ul>
                {cakeDetails.description && cakeDetails.description.map(desc => <li style={{listStylePosition: "inside"}} key={desc}>{desc}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
      {cakeDetails && cakeDetails.images && Array.isArray(cakeDetails.images) && <CakesSlide currentCake={cakeDetails} formatPrice={formatPrice} />}
    </>
  );
};

export default CakeDetails;