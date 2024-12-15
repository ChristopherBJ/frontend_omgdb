import React, { useState } from 'react'
import { useAuth } from "../components/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import '../styles/Login.css';
import { ReactComponent as Logo } from '../assets/Omg_main_logo.svg';




function Login() {
  const { loginAction } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await loginAction(email, password);
      
    } catch (err) {
      setError(err.message); // Set error message from loginAction
    }
  };

  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit} className="login-box">
      <Logo className="Logo1"/>
        <h1 className="header">Login</h1>
        <div className="text-container">
          <Form.Text className="text-muted">
            Type your email address
          </Form.Text>
        </div>
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
        </Form.Group>
        <div className="text-container">
          <Form.Text className="text-muted">
            Type your password
          </Form.Text>
        </div>
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

        {error && <p className="error">{error}</p>}
        <Button className="sub-button" variant="primary" type="submit">
          Login
        </Button>
        <a href="/signup">Not a member?</a>
        
      </Form>
    </div>
  );
}

export default Login;

