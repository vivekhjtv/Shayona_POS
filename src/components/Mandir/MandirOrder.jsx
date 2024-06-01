import React from 'react';
import MandirBulkOrder from './MandirBulkOrder';

function MandirOrder() {
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center mt-5">
          <h1>Place order for Mandir</h1>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <MandirBulkOrder />
      </div>
    </>
  );
}

export default MandirOrder;
