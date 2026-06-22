import React from 'react';
import { usePOSContext } from '../contexts/PosContext';
import { formatItemName } from '../utils/format';

function LeftSelectItem() {
  const {
    selectedItems,
    setSelectedItems,
    handlePlaceOrder,
    customerName,
    setCustomerName,
  } = usePOSContext();

  const handleChange = (e) => {
    // Get the current value
    const name = e.target.value;

    // Capitalize the first letter using charAt and toUpperCase
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    // Update the customerName state with the capitalized name
    setCustomerName(capitalizedName);
  };

  const incrementQuantity = (itemName) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (itemName) => {
    setSelectedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.name === itemName && item.quantity > 0
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="summary">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="summary_title mb-0">Current Order</h2>
        <span className="badge bg-secondary rounded-pill px-3 py-2" style={{ fontSize: '13px' }}>
          {selectedItems.reduce((acc, item) => acc + item.quantity, 0)} Items
        </span>
      </div>
      
      <div className="customer_name_wrapper">
        <label className="form-label">Customer Details</label>
        <input
          type="text"
          className="form-control customer_name"
          placeholder="Enter Customer Name"
          value={customerName}
          onChange={handleChange}
        />
      </div>

      <div className="selected_item_list">
        <ul className="selected-items-placeholder list-group">
          <li className="list-group-item list-header d-flex justify-content-between align-items-center">
            <div className="col-6">
              <span>Item Details</span>
            </div>
            <div className="col-3 text-center">
              <span>Quantity</span>
            </div>
            <div className="col-3 text-end">
              <span>Price</span>
            </div>
          </li>
          {selectedItems.length === 0 ? (
            <li className="list-group-item d-flex align-items-center justify-content-center py-5 text-muted">
              <span>No items selected yet. Click items on the right to add.</span>
            </li>
          ) : (
            selectedItems.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="col-6">
                  <span className="item-name">{formatItemName(item.name)}</span>
                </div>
                <div className="col-3">
                  <div className="quantity-controls">
                    <button
                      className="btn qty-btn"
                      onClick={() => decrementQuantity(item.name)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="qty-number">{item.quantity}</span>
                    <button
                      className="btn qty-btn"
                      onClick={() => incrementQuantity(item.name)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-3 text-end">
                  <span className="price-display">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="summary-footer">
        <div className="row align-items-center">
          <div className="col-6 total_container">
            <span className="total-label">Total Amount</span>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>
          <div className="col-6 text-end">
            <button
              id="place-order-btn"
              className="place-order-btn"
              onClick={() => handlePlaceOrder(customerName)}
              disabled={selectedItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSelectItem;
