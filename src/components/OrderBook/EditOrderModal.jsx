import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EditOrderModal = ({ show, handleClose, order }) => {
  const [editedOrder, setEditedOrder] = useState({
    orderDate: order.orderDate,
    orderTime: order.orderTime,
    orderNote: order.orderNote,
    orderDetails: order.orderDetails,
    orderTaker: order.orderTaker,
    customerName: order.customerName,
    customerNumber: order.customerNumber,
    paymentStatus: order.paymentStatus,
    amountPaid: order.amountPaid || '',
    amountRest: order.amountRest || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder({ ...editedOrder, [name]: value });
  };

  const handleSubmit = async () => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      const response = await axios.put(
        `${BASE_URL}/api/orderForm/${order._id}`,
        editedOrder
      );
      console.log('Updated Order Data:', response.data);
      handleClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Modal.Header closeButton className="bg-dark text-white border-0 p-4">
          <Modal.Title className="text-white mb-0" style={{ fontWeight: '600' }}>
            Edit Booked Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group controlId="orderDate">
                  <Form.Label>Delivery Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="orderDate"
                    value={editedOrder.orderDate ? editedOrder.orderDate.split('T')[0] : ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="orderTime">
                  <Form.Label>Delivery Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="orderTime"
                    value={editedOrder.orderTime}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="customerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={editedOrder.customerName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="customerNumber">
                  <Form.Label>Customer Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerNumber"
                    value={editedOrder.customerNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group controlId="orderDetails">
                  <Form.Label>Order Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="orderDetails"
                    value={editedOrder.orderDetails}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group controlId="orderNote">
                  <Form.Label>Preparation Note (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="orderNote"
                    value={editedOrder.orderNote}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group controlId="paymentStatus">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select
                    name="paymentStatus"
                    value={editedOrder.paymentStatus}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="done">Paid</option>
                    <option value="half">Half Paid</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {editedOrder.paymentStatus === 'half' && (
                <div className="col-12 p-3 bg-light border rounded mt-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Group controlId="amountPaid">
                        <Form.Label>Amount Paid ($)</Form.Label>
                        <Form.Control
                          type="number"
                          name="amountPaid"
                          value={editedOrder.amountPaid}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group controlId="amountRest">
                        <Form.Label>Amount Rest ($)</Form.Label>
                        <Form.Control
                          type="number"
                          name="amountRest"
                          value={editedOrder.amountRest}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-3 bg-light">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="px-4 py-2"
            style={{ borderRadius: '8px', fontWeight: '600' }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            className="px-4 py-2"
            style={{ borderRadius: '8px', fontWeight: '600' }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default EditOrderModal;
