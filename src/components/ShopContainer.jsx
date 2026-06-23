import React, { useEffect } from 'react';
import LeftSelectItem from './LeftSelectItem';
import RightItemsList from './RightItemsList';

function ShopContainer() {
  useEffect(() => {
    // Prevent scrolling on the body on desktop screens when POS is open
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="container-fluid pos-container">
      <div className="row pos-row">
        <div className="col-md-6 pos-left-col mb-4 mb-md-0">
          <LeftSelectItem />
        </div>
        <div className="col-md-6 pos-right-col">
          <RightItemsList />
        </div>
      </div>
    </div>
  );
}

export default ShopContainer;
