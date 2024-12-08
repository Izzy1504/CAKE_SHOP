import styles from './Cakes.module.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CakesSlide from './CakesSlide';
import { useStateContext } from '../../context/StateContextProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CakeDetails = () => {
  const { quantity, increaseQty, decreaseQty, formatPrice, AddToCart, handleCartClick,totalPrice, setTotalPrice,cartItems } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [cakeImage, setCakeImage] = useState(0);
  const [cakeDetails, setCakeDetails] = useState(null);
  const [navigateToPayment, setNavigateToPayment] = useState(false);
  const {  setQuantity} = useStateContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCakeDetails = async () => {
      try {
        const response = await axios.get(`http://26.214.87.26:8080/api/products/${id}`);
        if (response.status === 200) {
          console.log("Cake details:", response.data); // Log the data returned from the API
          setCakeDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching cake details:", error);
      }
    };

    fetchCakeDetails();
  }, [id]);
  
  useEffect(() => {
    if (navigateToPayment) {
      navigate('/PaymentPage', { state: { cartItems, totalPrice } });
    }
  }, [navigateToPayment, navigate, cartItems, cakeDetails, totalPrice, quantity]);

  const handleClickImage = (index) => {
    setCakeImage(index);
  };
 
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      console.log("Buy Now clicked");
      console.log("Cake details:", cakeDetails);

      if (cakeDetails) {
        if (quantity > cakeDetails.quantity) {
          toast.error("Product is out of stock");
          return;
        }
        const buyNowItem = {
          id: cakeDetails.id,
          name: cakeDetails.name,
          price: cakeDetails.price,
          quantity: quantity,
          totalPrice: cakeDetails.price * quantity,
          // Thêm các trường thông tin cần thiết khác nếu có
        };

        // Lưu thông tin sản phẩm vào localStorage
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));

        // Chuyển hướng đến trang thanh toán
        navigate('/PaymentPage', { state: { cartItems: [buyNowItem], totalPrice: buyNowItem.totalPrice } });
      }
    }
  };

  const handleAddToCart = (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      if (quantity > cakeDetails.quantity) {
        toast.error("Product is out of stock");
        return;
      }
      AddToCart(cakeDetails, e.target.innerText);
      handleCartClick();
    }
  };
  const handleGoBack = () => {
    setQuantity(1); // Reset quantity to 1
    navigate('/');
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value, 10) > 0 && parseInt(value, 10) <= cakeDetails.quantity)) {
      setQuantity(value === '' ? '' : parseInt(value, 10));
    } else if (parseInt(value, 10) > cakeDetails.quantity) {
      toast.error("Quantity exceeds available stock");
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < cakeDetails.quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Quantity exceeds available stock");
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <div className={styles.cakeDetailsPage}>
        <button className={styles.goBackBtn} onClick={handleGoBack}>Go Back</button>
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
                  <button onClick={handleDecreaseQty} className={styles.quantityBtn}>-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={cakeDetails.quantity}
                    className={styles.quantityInput}
                  />
                  <button onClick={handleIncreaseQty} className={styles.quantityBtn}>+</button>
                </div>
              </div>
              <button className={styles.addToCart} onClick={handleAddToCart}>Add to Cart</button>
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