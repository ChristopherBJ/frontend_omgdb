import React, { useState, useEffect } from 'react'
import { useAuth } from "../components/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';



function Login() {
  const { loginAction } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginAction(email, password);
  };

  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit} className="login-box">
        <h1 className="header">Login</h1>
        <Form.Group controlId="formBasicEmail">
          <FloatingLabel className="text-area" label="Email address">
            <Form.Control
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FloatingLabel>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <FloatingLabel className="text-area" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FloatingLabel>
        </Form.Group>
        <Button className="sub-button" variant="primary" type="submit">
          Login
        </Button>
        <a href="/register">Not a member?</a>
      </Form>
    </div>
  );
}

export default Login;
