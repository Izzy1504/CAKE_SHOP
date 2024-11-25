import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Orders.module.scss';
import EmptyState from './EmptyState'; // Ensure the path is correct
import { useStateContext } from '../../context/StateContextProvider'; // Ensure the path is correct

const Orders = () => {
  const { cartItems, totalQty, totalPrice, handleRemoveCart, formatPrice } = useStateContext();
  const navigate = useNavigate();

  const checkout = () => {
    // Xóa buyNowItem khỏi localStorage
    localStorage.removeItem('buyNowItem');
    navigate('/PaymentPage', { state: { cartItems, totalPrice } });
  };

  return (
    <div className={styles.ordersPage}>
      {cartItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.ordersContainer}>
          <h2>Your Orders</h2>
          <div className={styles.ordersList}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <img src={item.images[0]} alt={item.name} className={styles.orderImage} />
                <div className={styles.orderDetails}>
                  <h3>{item.name}</h3>
                  <p>{formatPrice(item.price)} vnđ</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => handleRemoveCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <p>Total Quantity: {totalQty}</p>
            <p>Total Price: {formatPrice(totalPrice)} vnđ</p>
            <button onClick={checkout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;