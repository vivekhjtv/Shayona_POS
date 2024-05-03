import React from 'react';
import { usePOSContext } from '../contexts/PosContext';
// import { Link } from 'react-router-dom';

function RightItemsList() {
  const { addItemToLeftList } = usePOSContext();
  return (
    <div className="item-selection">
      <h2 className="items_title">Available Items</h2>
      {/* <Link to="/orders" type="button" className="btn btn-danger me-2">
        Cart
      </Link> */}
      <div className="row">
        <div className="col-md-4">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList('Samosa', 3.5)}
          >
            <img src="samosa.png" className="card-img-top" alt="Samosa" />
            <div className="card-body">
              <h5 className="card-title item_title">Samosa - $3.50</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList('Dabeli', 3.5)}
          >
            <img src="dabeli.jpg" className="card-img-top" alt="Dabeli" />
            <div className="card-body">
              <h5 className="card-title item_title">Dabeli - $3.50</h5>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList('Puff', 4.0)}
          >
            <img src="veg-puff.jpg" className="card-img-top" alt="Puff" />
            <div className="card-body">
              <h5 className="card-title item_title">Puff - $4.00</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList('Khichadi', 5.0)}
          >
            <img src="khichadi.jpeg" className="card-img-top" alt="Khichadi" />
            <div className="card-body">
              <h5 className="card-title item_title">Khichadi - $5.00</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList('Pav Bhaji', 6.0)}
          >
            <img
              src="pav_bhaji.jpeg"
              className="card-img-top"
              alt="Pav Bhaji"
            />
            <div className="card-body">
              <h5 className="card-title item_title">Pav Bhaji - $6.00</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card card_item mb-3"
            onClick={() => addItemToLeftList('Papdi lot', 3.0)}
          >
            <img src="Khichu-3.jpg" className="card-img-top" alt="Papdi lot" />
            <div className="card-body">
              <h5 className="card-title item_title">Papdi lot - $3.00</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightItemsList;
