import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import EditOrderModal from './EditOrderModal';

function OrderFormCards() {
  const [orders, setOrders] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          'https://shayona-orders.vercel.app/api/orderForm'
        );
        // const response = await axios.get('http://localhost:8000/api/orderForm');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle opening the edit modal
  const handleEditModalOpen = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // Function to handle closing the edit modal
  const handleEditModalClose = () => {
    setSelectedOrder(null);
    setShowEditModal(false);
  };

  // Function to format date to display only the date part
  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  // Function to delete an order
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `https://shayona-orders.vercel.app/api/orderForm/${orderId}`
      );
      //   await axios.delete(`http://localhost:8000/api/orderForm/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Function to validate orders array
  const validateOrders = () => {
    const valid = orders.every(
      (order) =>
        order.orderDate &&
        order.orderTime &&
        order.customerName &&
        order.customerNumber &&
        order.orderDetails &&
        order.orderTaker &&
        order.paymentStatus
    );

    if (!valid) {
      setFormError('All orders must have required fields filled.');
    } else {
      setFormError('');
    }
  };

  useEffect(() => {
    validateOrders();
  }, [orders]);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">All Orders</h1>
      {formError && <Alert variant="danger">{formError}</Alert>}
      <Row xs={1} md={2} lg={3} className="g-4">
        {orders.map((order, index) => (
          <Col key={index}>
            <Card>
              <Card.Body>
                <Card.Title className="orderCardTitle">
                  Order {index + 1}
                </Card.Title>
                <Card.Text>
                  <strong>Order Date:</strong> {formatDate(order.orderDate)}
                </Card.Text>
                <Card.Text>
                  <strong>Order Time:</strong> {order.orderTime}
                </Card.Text>
                <Card.Text>
                  <strong>Customer Name:</strong> {order.customerName}
                </Card.Text>
                <Card.Text>
                  <strong>Customer Number:</strong> {order.customerNumber}
                </Card.Text>
                <Card.Text>
                  <strong>Order Description:</strong> {order.orderDetails}
                </Card.Text>
                <Card.Text>
                  <strong>Additional Notes:</strong> {order.orderNote}
                </Card.Text>
                <Card.Text>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </Card.Text>
                {order.paymentStatus === 'half' && (
                  <>
                    <Card.Text>
                      <strong>Amount Paid:</strong> {order.amountPaid}
                    </Card.Text>
                    <Card.Text>
                      <strong>Amount Rest:</strong> {order.amountRest}
                    </Card.Text>
                  </>
                )}
                <Card.Text>
                  <strong>Order By:</strong> {order.orderTaker}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleEditModalOpen(order)}
                >
                  Edit Order
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  Delete Order
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Edit Order Modal */}
      {selectedOrder && (
        <EditOrderModal
          show={showEditModal}
          handleClose={handleEditModalClose}
          order={selectedOrder}
        />
      )}
    </Container>
  );
}

export default OrderFormCards;
