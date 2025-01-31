import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        setError(null); // Clear any previous errors

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('jwtToken', data.token); // Store the token
            navigate('/'); // Redirect after successful login
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Set loading to false regardless of success/failure
        }
    };

    return (
        <Container>
            <h2>Login</h2>
            {loading && <div className="d-flex justify-content-center"><Spinner animation="border" /></div>} {/* Display spinner while loading */}
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}> {/* Disable button while loading */}
                    {loading ? "Logging in..." : "Login"} {/* Show "Logging in..." text while loading */}
                </Button>
            </Form>
        </Container>
    );
}

export default LoginForm;