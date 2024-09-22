import React from 'react';
import { usePOSContext } from '../contexts/PosContext';

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
      <div className="row">
        <h2 className="summary_title">Selected Items</h2>
      </div>
      <div className="col-sm-9 mb-1">
        <input
          type="text"
          className="form-control customer_name"
          placeholder="Enter Customer Name"
          value={customerName}
          style={{ fontSize: "26px" }}
          onChange={handleChange}
        />
      </div>
      <div className="selected_item_list">
        <ul className="selected-items-placeholder list-group mb-2">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="col-md-5">
              <span className="item-name list_title">
                <strong>Items</strong>
              </span>
            </div>
            <div className="col-md-4">
              <span className="item-name list_title">
                <strong>Quantity</strong>
              </span>
            </div>
            <div className="col-md-3">
              <span className="item-name list_title">
                <strong>Price</strong>
              </span>
            </div>
          </li>
          {selectedItems?.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="col-md-5">
                <span className="item-name list_title">{item.name}</span>
              </div>
              <div className="col-md-4 text-right ">
                <button
                  className="btn btn-primary px-3 list_title"
                  onClick={() => decrementQuantity(item.name)}
                  type="button"
                >
                  -
                </button>
                <span className="quantity list_title mx-3">
                  {item.quantity}
                </span>
                <button
                  className="btn btn-primary px-3 list_title"
                  onClick={() => incrementQuantity(item.name)}
                  type="button"
                >
                  +
                </button>
              </div>
              <div className="col-md-3">
                <span className="item-name list_title">{item.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="row">
        <div className="col-6 total_container">
          <div className="total">
            <strong>Total:</strong> ${total.toFixed(2)}
          </div>
        </div>
        <div className="col-6">
          <button
            id="place-order-btn"
            className="place-order-btn"
            onClick={() => handlePlaceOrder(customerName)}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeftSelectItem;
