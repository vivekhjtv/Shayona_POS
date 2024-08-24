import React, { useState } from 'react';
import axios from 'axios';
function MandirBulkOrder() {
  const [quantity, setQuantity] = useState({
    samosa: '',
    puff: '',
    dabeli: '',
    lilwa: '',
    patties: '',
  });

  const orderItems = [
    {
      name: 'samosa',
      label: 'Samosa',
      placeholder: 'Enter samosa quantity',
      inputType: 'input',
    },
    {
      name: 'puff',
      label: 'Puff',
      placeholder: 'Enter puff quantity',
      inputType: 'select',
    },
    {
      name: 'dabeli',
      label: 'Dabeli',
      placeholder: 'Enter dabeli quantity',
      inputType: 'input',
    },
    {
      name: 'lilwa',
      label: 'Lilwa Kachori',
      placeholder: 'Enter lilwa quantity',
      inputType: 'input',
    },
    {
      name: 'patties',
      label: 'Coconut Patties',
      placeholder: 'Enter patties quantity',
      inputType: 'input',
    },
    {
      name: 'veg_pizza',
      label: 'Veg Pizza',
      placeholder: 'Enter veg pizza quantity',
      inputType: 'input',
    },
    {
      name: 'cheese_pizza',
      label: 'Cheese Pizza',
      placeholder: 'Enter Cheese Pizza quantity',
      inputType: 'input',
    },
    {
      name: 'khichadi',
      label: 'Khichadi',
      placeholder: 'Enter Khichadi quantity',
      inputType: 'input',
    },
    {
      name: 'papadi_no_lot',
      label: 'Papadi no lot',
      placeholder: 'Enter Papadi no lot quantity',
      inputType: 'input',
    },
    {
      name: 'pav_bhaji',
      label: 'Pav Bhaji',
      placeholder: 'Enter Pav Bhaji quantity',
      inputType: 'input',
    },
  ];

  const handleChange = (e, name) => {
    setQuantity((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const addQuantity = async () => {
    const store = 'Mandir';
    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };

    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);
    try {
      // await axios.post('http://localhost:8000/api/store-order', {
      await axios.post('https://shayona-pos-backend.onrender.com/api/store-order', {
        samosa: quantity.samosa,
        puff: quantity.puff,
        dabeli: quantity.dabeli,
        lilwa: quantity.lilwa,
        patties: quantity.patties,
        veg_pizza: quantity.veg_pizza,
        cheese_pizza: quantity.cheese_pizza,
        khichadi: quantity.khichadi,
        papadi_no_lot: quantity.papadi_no_lot,
        pav_bhaji: quantity.pav_bhaji,
        easternDate: easternDate,
        easternTime: easternTime,
        store: store,
      });

      setQuantity({
        samosa: '',
        puff: '',
        dabeli: '',
        lilwa: '',
        patties: '',
        veg_pizza: '',
        cheese_pizza: '',
        khichadi: '',
        papadi_no_lot: '',
        pav_bhaji: '',
      });
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#mandirOrderModel"
      >
        Mandir Store Order
      </button>

      <div
        className="modal fade"
        id="mandirOrderModel"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Mandir Order
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
                {orderItems.map((item, index) => (
                  <div className="col-sm-6 mb-3" key={index}>
                    <label
                      htmlFor={`input-${item.name}`}
                      className="form-label model_input"
                    >
                      {item.label}
                    </label>
                    {item.inputType === 'select' ? ( // Conditionally render select or input based on inputType
                      <select
                        className="form-select"
                        id={`input-${item.name}`}
                        value={quantity[item.name]}
                        onChange={(e) => handleChange(e, item.name)}
                      >
                        <option value="0">Select</option>
                        <option value="0 Tray">0 Tray</option>
                        <option value="1 Tray">1 Tray</option>
                        <option value="2 Tray">2 Tray</option>
                        <option value="3 Tray">3 Tray</option>
                        <option value="4 Tray">4 Tray</option>
                        <option value="5 Tray">5 Tray</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        className="form-control"
                        id={`input-${item.name}`}
                        placeholder={item.placeholder}
                        value={quantity[item.name]}
                        onChange={(e) => handleChange(e, item.name)}
                      />
                    )}
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
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MandirBulkOrder;
