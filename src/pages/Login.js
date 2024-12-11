import React, { useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const navigate = useNavigate();





  // Function to handle form submission
  const handleLogin = (event) => {
    event.preventDefault(); // Prevent page reload



    if (!email || password.length < 8) {

      if (!email && password.length < 8) {
        alert('Please fill all fields');
        return;
      } else if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      } else if (!email) {
        alert('Please fill email field');
        return;
      }
    }


    onLogin(); // Update login state
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className='login-container'>
      <Form onSubmit={handleLogin} className='login-box'>
        <h1 className='header'>Login</h1>
        <Form.Group controlId="formBasicEmail" >
          <FloatingLabel className="text-area" label="Email address">
            <Form.Control type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </FloatingLabel>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <FloatingLabel className="text-area" label="Password">
            <Form.Control type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </FloatingLabel>
        </Form.Group>
        <Button className="sub-button" variant="primary" type="submit">
          Login
        </Button>
        <a href="/register">not a member</a>
      </Form>
    </div>
  );
}

export default Login
