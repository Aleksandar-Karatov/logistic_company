import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from './utils';
import AuthContext from './authContext'; // Import the AuthContext

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiUrl = getApiUrl();
    const { login } = useContext(AuthContext); // Access the login function from the context

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear any previous errors

        try {
            const response = await fetch(`${apiUrl}/api/login`, {
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

            const data = await response.json(); // Get the token, role, and email

            login(data); // Update the context using the login function
            navigate('/'); // Redirect after login

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default LoginForm;