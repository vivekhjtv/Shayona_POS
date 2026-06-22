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
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    const store = 'Mandir';
    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };

    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);
    try {
      await axios.post(`${BASE_URL}/api/store-order`, {
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

  const [successMsg, setSuccessMsg] = useState(false);

  const handleReset = () => {
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
  };

  const handlePlaceOrderClick = async () => {
    await addQuantity();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="card-form-wrapper shadow-sm border p-4 p-md-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ fontSize: '36px' }}>🛕</div>
        <div>
          <h2 className="order_title mb-1">Mandir Bulk Order Form</h2>
          <p className="text-muted mb-0">Submit bulk delivery batches for Mandir kitchen logs.</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <strong>Success!</strong> Mandir bulk order has been successfully placed in the kitchen queue.
          <button type="button" className="btn-close" onClick={() => setSuccessMsg(false)} />
        </div>
      )}

      <div className="row">
        {orderItems.map((item, index) => (
          <div className="col-sm-6 mb-3" key={index}>
            <label
              htmlFor={`input-${item.name}`}
              className="form-label"
            >
              {item.label}
            </label>
            {item.inputType === 'select' ? (
              <select
                className="form-select"
                id={`input-${item.name}`}
                value={quantity[item.name] || ''}
                onChange={(e) => handleChange(e, item.name)}
              >
                <option value="">Select Tray Count</option>
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
                value={quantity[item.name] || ''}
                onChange={(e) => handleChange(e, item.name)}
                min="0"
              />
            )}
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary px-4 py-2"
          onClick={handleReset}
          style={{ borderRadius: '8px', fontWeight: '600' }}
        >
          Reset Form
        </button>
        <button
          type="button"
          className="btn btn-primary px-4 py-2"
          onClick={handlePlaceOrderClick}
          style={{ borderRadius: '8px', fontWeight: '600' }}
        >
          Place Mandir Order
        </button>
      </div>
    </div>
  );
}

export default MandirBulkOrder;
