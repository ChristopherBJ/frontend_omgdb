import React, { useState, useEffect } from 'react'
import { useAuth } from "../components/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import '../styles/Login.css';

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(""); // For displaying errors
    const [success, setSuccess] = useState(""); // For success messages
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(""); // Clear previous errors
      setSuccess(""); // Clear previous success messages
  
      // Validate that passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
  
      try {
        // Make API call to create user
        const response = await fetch("https://localhost/api/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
  
        if (response.ok) {
          const res = await response.json();
          setSuccess("Account created successfully! You can now log in.");
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          const errorText = await response.text();
          setError(`Sign up failed: ${errorText}`);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred. Please try again.");
      }
    };
  
    return (
        <div className="login-container">
            <Form onSubmit={handleSubmit} className="login-box">
                <h1 className="header">Sign up</h1>

                {/* Name Input Field */}
                <Form.Group controlId="formBasicName">
                    <FloatingLabel className="text-area" label="Full name">
                        <Form.Control
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FloatingLabel>
                    <Form.Text className="text-muted">
                        Type your Full name here
                    </Form.Text>
                </Form.Group>

                {/* Email Input Field */}
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
                        Type your email address here
                    </Form.Text>
                </Form.Group>

                {/* Password Input Field */}
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
                    <Form.Text className="text-muted">
                        Type your password here
                    </Form.Text>
                </Form.Group>

                {/* Confirm Password Input Field */}
                <Form.Group controlId="formBasicPasswordConfirm">
                    <FloatingLabel className="text-area" label="Confirm Password">
                        <Form.Control
                            type="password"
                            placeholder="Confirm your Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </FloatingLabel>
                    <Form.Text className="text-muted">
                        Conform your password here
                    </Form.Text>
                </Form.Group>


                {/* Error Message */}
                {error && <p className="error-text">{error}</p>}

                {/* Submit Button */}
                <Button className="sub-button" variant="primary" type="submit">
                    Sign Up
                </Button>

                {/* Link to login */}
                <a href="/login">Already a member?</a>
            </Form>
        </div>
    );
}

export default SignUp;