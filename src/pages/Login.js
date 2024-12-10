import React, {useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // Function to handle form submission
    const handleLogin = (event) => {
      event.preventDefault(); // Prevent page reload

    

      
      onLogin(); // Update login state
      navigate('/'); // Navigate to the home page
    };

    return (
      <div className='login-container'>
        <Form onSubmit={handleLogin} className='login-box'> 
          <Form.Group controlId="formBasicEmail" >
            <Form.Label >Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
    
          <Form.Group  controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
      );
}

export default Login
