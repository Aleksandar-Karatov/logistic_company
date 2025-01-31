// src/components/CreateClientForm.js
import React, { useState, useEffect } from 'react'; // Add useEffect here
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {getApiUrl, getAuthHeaders } from './utils';

function CreateClientForm({ companies }) {
    const navigate = useNavigate();
    const [client, setClient] = useState({
        name: '',
        email: '',
        phone: '',
        companyId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companiesData, setCompaniesData] = useState(companies || []);
    const apiUrl = getApiUrl();  // Call the utility function

    useEffect(() => {
        if (!companies) {
            const fetchCompanies = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/company`, { headers: getAuthHeaders() });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setCompaniesData(data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchCompanies();
        } else {
            setCompaniesData(companies);
        }
    }, [companies, apiUrl]);

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/client/register`, { // Use the correct endpoint for client registration
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(client),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            navigate('/clients'); // Redirect on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2>Create Client</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={client.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={client.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={client.phone} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="company">
                    <Form.Label>Company</Form.Label>
                    <Form.Control as="select" name="companyId" value={client.companyId} onChange={handleChange} required>
                        <option value="">Select Company</option>
                        {companiesData.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </Form>
        </Container>
    );
}

export default CreateClientForm;