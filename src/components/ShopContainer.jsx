import React from 'react';
import LeftSelectItem from './LeftSelectItem';
import RightItemsList from './RightItemsList';

function ShopContainer() {
  return (
    <div className="container-fluid main_wrapper">
      <div className="row">
        <div className="col-md-6">
          <LeftSelectItem />
        </div>
        <div className="col-md-6">
          <RightItemsList />
        </div>
      </div>
    </div>
  );
}

export default ShopContainer;
