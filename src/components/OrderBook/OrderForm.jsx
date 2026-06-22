import React, { useState } from 'react';
import { Form, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const OrderForm = () => {
  const [orderDate, setOrderDate] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
  const [orderTaker, setOrderTaker] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [amountRest, setAmountRest] = useState('');
  const [formError, setFormError] = useState('');

  const [successMsg, setSuccessMsg] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(false);
    
    // Simple validation
    if (
      !orderDate ||
      !orderTime ||
      !customerName ||
      !customerNumber ||
      !orderDetails ||
      !orderTaker ||
      !paymentStatus
    ) {
      setFormError('Please fill all the required fields.');
      return;
    }

    const orderData = {
      orderDate,
      orderTime,
      orderNote,
      orderDetails,
      orderTaker,
      customerName,
      customerNumber,
      paymentStatus,
      amountPaid: paymentStatus === 'half' ? amountPaid : null,
      amountRest: paymentStatus === 'half' ? amountRest : null,
    };

    const currentDateTime = new Date();
    const options = { timeZone: 'America/Toronto', hour12: true };
    const easternDate = currentDateTime.toLocaleDateString('en-CA', options);
    const easternTime = currentDateTime.toLocaleTimeString('en-US', options);

    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    try {
      await axios.post(`${BASE_URL}/api/orderForm`, {
        orderDate: orderData.orderDate,
        orderTime: orderData.orderTime,
        orderNote: orderData.orderNote,
        orderDetails: orderData.orderDetails,
        orderTaker: orderData.orderTaker,
        customerName: orderData.customerName,
        customerNumber: orderData.customerNumber,
        paymentStatus: orderData.paymentStatus,
        amountPaid: orderData.amountPaid,
        amountRest: orderData.amountRest,
        easternDate: easternDate,
        easternTime: easternTime,
      });
      // Clear form after successful submission
      setOrderDate('');
      setOrderTime('');
      setOrderNote('');
      setOrderDetails('');
      setOrderTaker('');
      setCustomerName('');
      setCustomerNumber('');
      setPaymentStatus('');
      setAmountPaid('');
      setAmountRest('');
      setFormError('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (error) {
      console.error('Error saving order:', error);
      setFormError('Error saving order. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col lg={9} xl={8}>
          <div className="card-form-wrapper shadow-sm border p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ fontSize: '36px' }}>📝</div>
              <div>
                <h2 className="order_title mb-1">Book New Order</h2>
                <p className="text-muted mb-0">Fill in the details to book a custom future delivery order.</p>
              </div>
            </div>

            {formError && <Alert variant="danger" className="mb-4">{formError}</Alert>}
            {successMsg && (
              <Alert variant="success" className="mb-4">
                <strong>Success!</strong> The custom order details have been successfully saved to the Order Book!
              </Alert>
            )}

            <Form onSubmit={handleFormSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="orderDate">
                    <Form.Label>Delivery Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="orderTime">
                    <Form.Label>Delivery Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={orderTime}
                      onChange={(e) => setOrderTime(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="customerName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="customerNumber">
                    <Form.Label>Customer Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="e.g. 647-123-4567"
                      value={customerNumber}
                      onChange={(e) => setCustomerNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="orderDetails">
                <Form.Label>Order Description & Items</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe the items ordered, quantities, or specific details..."
                  value={orderDetails}
                  onChange={(e) => setOrderDetails(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="orderNote">
                <Form.Label>Preparation Notes (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Extra spicy, pack sauces separately"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
              </Form.Group>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group controlId="orderTaker">
                    <Form.Label>Order Taken By</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Staff member name"
                      value={orderTaker}
                      onChange={(e) => setOrderTaker(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="paymentStatus">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      required
                    >
                      <option value="">Select status</option>
                      <option value="done">Fully Paid</option>
                      <option value="half">Half Paid / Deposit</option>
                      <option value="pending">Unpaid / Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {paymentStatus === 'half' && (
                <div className="p-3 mb-4 bg-light border rounded" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="amountPaid">
                        <Form.Label>Deposit Amount ($)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Amount paid"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="amountRest">
                        <Form.Label>Remaining Balance ($)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Amount due"
                          value={amountRest}
                          onChange={(e) => setAmountRest(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              <button 
                type="submit" 
                className="place-order-btn w-100"
                style={{ fontWeight: '600', padding: '14px', borderRadius: '10px' }}
              >
                Save Order Details
              </button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderForm;
