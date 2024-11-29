import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import ProductList from "./ProductList";

const ParentComponent = () => {
  const [products, setProducts] = useState([]);

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };

  return (
    <div>
      <CategoryFilter
        // ...existing props...
        updateProducts={updateProducts}
      />
      {/* Render the products list */}
      <ProductList products={products} />
    </div>
  );
};

export default ParentComponent;