import React, { useState } from 'react';
import { usePOSContext } from '../contexts/PosContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = usePOSContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/orders'); // Redirect to Kitchen board on success
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Row className="justify-content-center w-100 m-0">
        <Col md={6} lg={5} xl={4}>
          <div className="card-form-wrapper shadow border p-4">
            <div className="text-center mb-4">
              <img 
                src="Shayona_icon.png" 
                height="80" 
                alt="Shayona Logo" 
                className="mb-3"
                onError={(e) => { e.target.src = "logo.svg"; }}
              />
              <h2 className="order_title mb-1">Admin Portal</h2>
              <p className="text-muted small">Log in to manage kitchen orders, inventory, and menus.</p>
            </div>

            {error && <Alert variant="danger" className="py-2" style={{ fontSize: '14px' }}>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <button
                type="submit"
                className="place-order-btn w-100"
                style={{ fontWeight: '600', padding: '12px', borderRadius: '10px' }}
              >
                Log In
              </button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
