import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      await axios.post('http://localhost:8000/api/orderForm', {
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
    } catch (error) {
      console.error('Error saving order:', error);
      setFormError('Error saving order. Please try again.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-4">
        <Col md={8}>
          <h1 className="text-center">Order Details</h1>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="orderDate">
                  <Form.Label>Order Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="orderTime">
                  <Form.Label>Order Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={orderTime}
                    onChange={(e) => setOrderTime(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mt-2" controlId="customerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mt-2" controlId="customerNumber">
                  <Form.Label>Customer Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter customer number"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-2" controlId="orderDetails">
              <Form.Label>Order Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter order details..."
                value={orderDetails}
                onChange={(e) => setOrderDetails(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="orderNote">
              <Form.Label>Order Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add additional notes regarding order?"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="orderTaker">
              <Form.Label>Order By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name of the person who took the order"
                value={orderTaker}
                onChange={(e) => setOrderTaker(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-2" controlId="paymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="">Select payment status</option>
                <option value="done">Payment Done</option>
                <option value="half">Half Done</option>
                <option value="pending">Pending</option>
              </Form.Control>
            </Form.Group>
            {paymentStatus === 'half' && (
              <>
                <Form.Group className="mt-2" controlId="amountPaid">
                  <Form.Label>Amount Paid</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mt-2" controlId="amountRest">
                  <Form.Label>Amount Rest</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount rest"
                    value={amountRest}
                    onChange={(e) => setAmountRest(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Save Order Details
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderForm;
