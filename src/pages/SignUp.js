import React, { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import '../styles/Login.css';
import { ReactComponent as Logo } from '../assets/Omg_main_logo.svg';


function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(""); // For displaying errors
    const [success, setSuccess] = useState(""); // For success messages
    const [isSuccess, setIsSuccess] = useState(false); // Track success state

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const hasMatch = password === confirmPassword;
    const isValidPassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const HOST = process.env.REACT_APP_OMG_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setSuccess(""); // Clear previous success messages

        if (password.length < 8) {
            setError("Password must be at least 8 characters long!");
            return;
        }

        // Validate that passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        try {
            // Make API call to create user
            const response = await fetch(`${HOST}/api/user/create`, {
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
                setSuccess(`${name}! Your account was created successfully! You can now login by clicking the link`);
                setIsSuccess(true);
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
            <div className="login-box">
                {!isSuccess ? (
                    <Form onSubmit={handleSubmit}>
                        <Logo className="Logo1"/>
                        <h1 className="header">Sign up</h1>

                        {/* Name Input Field */}
                        <div className="text-container">
                            <Form.Text className="text-muted">
                                Type your full name
                            </Form.Text>
                        </div>
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

                        </Form.Group>

                        {/* Email Input Field */}
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

                        {/* Password Input Field */}
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
                            <div className="password-rules">
                                <div className="password-column">
                                    <ul>
                                        <li className={hasLowercase ? 'valid' : 'invalid'}>One lowercase character</li>
                                        <li className={hasUppercase ? 'valid' : 'invalid'}>One uppercase character</li>
                                        <li className={hasNumber ? 'valid' : 'invalid'}>One number</li>
                                    </ul>
                                </div>
                                <div className="password-column">
                                    <ul>
                                        <li className={hasSpecialChar ? 'valid' : 'invalid'}>One special character</li>
                                        <li className={hasMinLength ? 'valid' : 'invalid'}>8 characters minimum</li>
                                    </ul>
                                </div>
                            </div>

                        </Form.Group>

                        {/* Confirm Password Input Field */}
                        <div className="text-container">
                            <Form.Text className="text-muted">
                                Confirm your password
                            </Form.Text>
                        </div>
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
                            {!hasMatch && (
                                <Form.Text className="error-text">
                                    Passwords do not match.
                                </Form.Text>)}

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
                ) : (
                    // Show success message if successful
                    <div className="success-message">
                        <p className="success-text">
                            Welcome {success} <a href="/login">here.</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SignUp;