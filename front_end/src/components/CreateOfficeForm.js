// src/components/CreateOfficeForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, getAuthHeaders } from './utils';

function CreateOfficeForm({ companies }) {
    const navigate = useNavigate();
    const [office, setOffice] = useState({
        location: '',
        companyId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companiesData, setCompaniesData] = useState(companies || []);
    const apiUrl = getApiUrl();
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
        setOffice({ ...office, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/office`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(office),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            navigate('/offices'); // Redirect on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2>Create Office</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={office.location} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="company">
                    <Form.Label>Company</Form.Label>
                    <Form.Control as="select" name="companyId" value={office.companyId} onChange={handleChange} required>
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

export default CreateOfficeForm;