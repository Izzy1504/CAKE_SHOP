import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export const StateContext = createContext();

export default function StateContextProvider({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalQty, setTotalQty] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [cake, setCake] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const cakeRef = useRef();

  useEffect(() => {
    if (totalQty === 0) {
      setTotalPrice(0);
    }
  }, [totalQty]);

  const handleNavMenu = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleNavLinks = (anchor) => () => {
    // Your existing handleNavLinks logic
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const onAddClick = (product, action) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    setTotalPrice(totalPrice + product.price * quantity);
    setTotalQty(totalQty + quantity);
    console.log(`${action} clicked for product:`, product);
  };

  const handleCartClick = () => {
    setShowCart(prevShowCart => !prevShowCart);
  };

  const handleRemoveCart = (id) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (itemToRemove) {
      setCartItems(cartItems.filter(item => item.id !== id));
      setTotalPrice(totalPrice - (itemToRemove.price * itemToRemove.quantity));
      setTotalQty(totalQty - itemToRemove.quantity);
    }
  };

  const increaseQty = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <StateContext.Provider value={{
      isNavOpen,
      quantity,
      totalQty,
      showCart,
      cake,
      cartItems,
      totalPrice,
      cakeRef,
      handleNavMenu,
      handleNavLinks,
      formatPrice,
      onAddClick,
      handleCartClick,
      handleRemoveCart,
      increaseQty,
      decreaseQty
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);