import React from 'react';
import { usePOSContext } from '../contexts/PosContext';

function RightItemsList() {
  const { addItemToLeftList } = usePOSContext();

  const items = [
    // { name: 'Samosa', price: 3.5, imgSrc: 'samosa.png', alt: 'Samosa' },
    // { name: 'Dabeli', price: 3.5, imgSrc: 'dabeli.jpg', alt: 'Dabeli' },
    // { name: 'Puff', price: 4.0, imgSrc: 'veg-puff.jpg', alt: 'Puff' },
    { name: 'Khichadi', price: 5.0, imgSrc: 'khichadi.jpeg', alt: 'Khichadi' },
    {
      name: 'Pav Bhaji',
      price: 6.0,
      imgSrc: 'pav_bhaji.jpeg',
      alt: 'Pav Bhaji',
    },
    { name: 'Papdi lot', price: 3.0, imgSrc: 'Khichu-3.jpg', alt: 'Papdi lot' },
    {
      name: 'Cheese Pizza',
      price: 6.0,
      imgSrc: 'cheese_pizza.jpeg',
      alt: 'Cheese Pizza',
    },
    {
      name: 'Veg Pizza',
      price: 7.0,
      imgSrc: 'veg_pizza.webp',
      alt: 'Veg Pizza',
    },
  ];

  return (
    <div className="item-selection">
      <h2 className="items_title">Available Items</h2>

      <div className="row">
        {items.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="card card_item mb-3"
              onClick={() => addItemToLeftList(item.name, item.price)}
            >
              <img src={item.imgSrc} className="card-img-top" alt={item.alt} />
              <div className="card-body">
                <h5 className="card-title item_title">{item.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RightItemsList;
