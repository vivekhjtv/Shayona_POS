import React, { useState } from 'react';
import axios from 'axios';

function StoreBulkOrder() {
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
  ];

  const handleChange = (e, name) => {
    setQuantity((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const addQuantity = async () => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    const store = 'Store';
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
        easternDate: easternDate,
        easternTime: easternTime,
        store: store,
      });
      // console.log('Order saved:', response.data);

      setQuantity({
        samosa: '',
        puff: '',
        dabeli: '',
        lilwa: '',
        patties: '',
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
    });
  };

  const handlePlaceOrderClick = async () => {
    await addQuantity();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="card-form-wrapper shadow-sm border p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ fontSize: '36px' }}>🏪</div>
              <div>
                <h2 className="order_title mb-1">Store Bulk Order Form</h2>
                <p className="text-muted mb-0">Submit bulk delivery batches for Store stock logs.</p>
              </div>
            </div>

            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                <strong>Success!</strong> Store bulk order has been successfully placed in the kitchen queue.
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
                Place Store Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreBulkOrder;
