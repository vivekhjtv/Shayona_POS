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
    try {
      const response = await axios.put(
        `https://shayona-pos-backend.onrender.com/api/orderForm/${order._id}`, // Assuming your API endpoint for updating an order by ID
        // `http://localhost:8000/api/orderForm/${order._id}`,
        editedOrder
      );
      console.log('Updated Order Data:', response.data);
      handleClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="orderDate">
            <Form.Label>Order Date</Form.Label>
            <Form.Control
              type="date"
              name="orderDate"
              value={editedOrder.orderDate}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="orderTime">
            <Form.Label>Order Time</Form.Label>
            <Form.Control
              type="time"
              name="orderTime"
              value={editedOrder.orderTime}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="customerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={editedOrder.customerName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="customerNumber">
            <Form.Label>Customer Number</Form.Label>
            <Form.Control
              type="text"
              name="customerNumber"
              value={editedOrder.customerNumber}
              onChange={handleInputChange}
            />
          </Form.Group>
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
          <Form.Group controlId="orderNote">
            <Form.Label>Order Note</Form.Label>
            <Form.Control
              type="text"
              name="orderNote"
              value={editedOrder.orderNote}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="paymentStatus">
            <Form.Label>Payment Status</Form.Label>
            <Form.Control
              as="select"
              name="paymentStatus"
              value={editedOrder.paymentStatus}
              onChange={handleInputChange}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="half">Half Done</option>
            </Form.Control>
          </Form.Group>
          {editedOrder.paymentStatus === 'half' && (
            <>
              <Form.Group controlId="amountPaid">
                <Form.Label>Amount Paid</Form.Label>
                <Form.Control
                  type="text"
                  name="amountPaid"
                  value={editedOrder.amountPaid}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amountRest">
                <Form.Label>Amount Rest</Form.Label>
                <Form.Control
                  type="text"
                  name="amountRest"
                  value={editedOrder.amountRest}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditOrderModal;
