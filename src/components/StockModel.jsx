import React, { useState } from 'react';
import axios from 'axios';

function StockModel() {
  const [quantity, setQuantity] = useState({
    khichadi: '',
    bhaji: '',
    lot: '',
    cheesePizza: '',
    vegPizza: '',
    thali: '',
  });

  const items = [
    {
      name: 'khichadi',
      label: 'Khichadi',
      placeholder: 'Enter khichadi quantity',
    },
    {
      name: 'bhaji',
      label: 'Pav Bhaji',
      placeholder: 'Enter Pav Bhaji quantity',
    },
    {
      name: 'lot',
      label: 'Papdi Lot',
      placeholder: 'Enter papdi lot quantity',
    },
    {
      name: 'cheesePizza',
      label: 'Cheese Pizza',
      placeholder: 'Enter Cheese Pizza quantity',
    },
    {
      name: 'vegPizza',
      label: 'Veg Pizza',
      placeholder: 'Enter Veg Pizza quantity',
    },
    {
      name: 'thali',
      label: 'Special Thali',
      placeholder: 'Enter Special Thali quantity',
    },
  ];

  const handleChange = (e, name) => {
    setQuantity((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const addQuantity = async () => {
    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };

    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);
    try {
      await axios.post('http://localhost:8000/api/stock', {
        khichadi: quantity.khichadi,
        pav_bhaji: quantity.bhaji,
        lot: quantity.lot,
        veg_pizza: quantity.vegPizza,
        cheese_pizza: quantity.cheesePizza,
        thali: quantity.thali,
        easternDate: easternDate,
        easternTime: easternTime,
      });

      setQuantity({
        khichadi: '',
        bhaji: '',
        lot: '',
        cheesePizza: '',
        vegPizza: '',
        thali: '',
      });
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary mb-2 "
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add Stokes
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Enter Quantity
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {items.map((item, index) => (
                  <div className="col-sm-6 mb-3" key={index}>
                    <label
                      htmlFor={`input-${item.name}`}
                      className="form-label model_input"
                    >
                      {item.label}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`input-${item.name}`}
                      placeholder={item.placeholder}
                      value={quantity[item.name]}
                      onChange={(e) => handleChange(e, item.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addQuantity}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StockModel;
