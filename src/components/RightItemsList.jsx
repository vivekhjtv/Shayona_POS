import React, { useState, useEffect } from "react";
import { usePOSContext } from "../contexts/PosContext";
import axios from "axios";

function RightItemsList() {
  const [products, setProducts] = useState([]);
  const [itemCount, setItemCount] = useState({});
  const [loading, setLoading] = useState(true);

  const { addItemToLeftList } = usePOSContext();

  const BASE_URL = process.env.REACT_APP_GLOBAL_URL;

  const fetchProductsAndStock = async () => {
    try {
      setLoading(true);
      // Fetch dynamic menu products and stock counts in parallel
      const [productsRes, stockRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products`),
        axios.get(`${BASE_URL}/api/stock`)
      ]);
      setProducts(productsRes.data);
      if (stockRes.data && stockRes.data.length > 0) {
        setItemCount(stockRes.data[0]);
      }
    } catch (error) {
      console.error("Error fetching items/stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStockCount = async (itemKey, newCount) => {
    try {
      await axios.put(`${BASE_URL}/api/stock/${itemKey}`, {
        count: newCount,
      });
      setItemCount((prevCount) => ({
        ...prevCount,
        [itemKey]: newCount,
      }));
    } catch (error) {
      console.error("Error updating stock count:", error);
    }
  };

  const handleItemClick = (itemKey, price, currentCount) => {
    // If stock count is not defined or is empty/null, bypass stock checks (e.g. for Extra Pav or service items)
    if (currentCount === undefined || currentCount === null || currentCount === "") {
      addItemToLeftList(itemKey, price);
      return;
    }

    const countNum = Number(currentCount);
    if (countNum > 0) {
      const newCount = countNum - 1;
      updateStockCount(itemKey, newCount);
      addItemToLeftList(itemKey, price);
    } else {
      alert("Out of stock");
    }
  };

  useEffect(() => {
    fetchProductsAndStock();
  }, []);

  if (loading) {
    return (
      <div className="item-selection text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading available items...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="item-selection">
      <h2 className="items_title">Available Items</h2>
      <div className="row">
        {products.map((product) => {
          const count = itemCount[product.key];
          const isStockTracked = count !== undefined && count !== null && count !== "";
          
          return (
            <div className="col-md-3 mb-4" key={product._id}>
              <div
                className="card card_item h-100"
                onClick={() =>
                  handleItemClick(product.key, product.price, count)
                }
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={product.imageUrl || product.image || "default_item.jpeg"}
                  className="card-img-top"
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "default_item.jpeg";
                  }}
                  style={{ height: '110px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex align-items-center justify-content-center text-center">
                  <h5 className="card-title item_title">
                    {product.name} {isStockTracked ? `(${count})` : ""}
                  </h5>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RightItemsList;
