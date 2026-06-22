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
      const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
      try {
        const response = await axios.get(`${BASE_URL}/api/orderForm`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);
// console.log(orders)
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
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      await axios.delete(`${BASE_URL}/api/orderForm/${orderId}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'done':
        return <span className="badge bg-success px-3 py-2 rounded-pill">Fully Paid</span>;
      case 'half':
        return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Deposit Paid</span>;
      default:
        return <span className="badge bg-danger px-3 py-2 rounded-pill">Unpaid</span>;
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '100vh' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="order_title mb-0">Custom Booked Orders</h1>
        <span className="badge bg-dark px-3 py-2 rounded-pill" style={{ fontSize: '14px' }}>
          Total: {orders.length} Booked
        </span>
      </div>

      {formError && <Alert variant="danger" className="mb-4">{formError}</Alert>}

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 className="text-muted">No custom booked orders.</h3>
          <p className="text-muted">Orders booked via the booking form will appear here.</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {orders.map((order, index) => (
            <Col key={order._id || index}>
              <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Card.Header className="bg-dark text-white p-3 border-0 d-flex align-items-center justify-content-between">
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>Booked Order #{index + 1}</span>
                  {getPaymentBadge(order.paymentStatus)}
                </Card.Header>
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="mb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Delivery Date:</span>
                      <strong className="text-dark">{formatDate(order.orderDate)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Delivery Time:</span>
                      <strong className="text-dark">{order.orderTime}</strong>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-muted small mb-1">Customer Details:</h6>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{order.customerName}</div>
                    <div className="text-muted small">{order.customerNumber}</div>
                  </div>

                  <div className="mb-3 flex-grow-1">
                    <h6 className="text-muted small mb-1">Order Details:</h6>
                    <div className="p-3 bg-light rounded" style={{ fontSize: '14px', whiteSpace: 'pre-wrap', minHeight: '60px' }}>
                      {order.orderDetails}
                    </div>
                  </div>

                  {order.orderNote && (
                    <div className="mb-3">
                      <h6 className="text-muted small mb-1">Preparation Note:</h6>
                      <div className="text-warning small" style={{ fontWeight: '500' }}>
                        ⚠️ {order.orderNote}
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'half' && (
                    <div className="p-3 mb-3 bg-light rounded border border-warning" style={{ fontSize: '13px' }}>
                      <div className="d-flex justify-content-between">
                        <span>Paid Deposit:</span>
                        <strong>${Number(order.amountPaid).toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between text-danger">
                        <span>Remaining:</span>
                        <strong>${Number(order.amountRest).toFixed(2)}</strong>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="text-muted small">Taken by: <strong>{order.orderTaker}</strong></span>
                    <div>
                      <Button
                        variant="outline-primary"
                        className="btn-sm me-2 px-3"
                        style={{ borderRadius: '6px', fontWeight: '600' }}
                        onClick={() => handleEditModalOpen(order)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="btn-sm px-3"
                        style={{ borderRadius: '6px', fontWeight: '600' }}
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this custom booked order?")) {
                            handleDeleteOrder(order._id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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
