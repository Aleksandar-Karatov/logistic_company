import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, getAuthHeaders } from './utils';

function CreateEmployeeForm({ companies, offices }) {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        phone: '',
        companyId: '',
        officeId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companiesData, setCompaniesData] = useState(companies || []);
    const [officesData, setOfficesData] = useState(offices || []);
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

        if (!offices) {
            const fetchOffices = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/v1/office`, { headers: getAuthHeaders() });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setOfficesData(data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchOffices();
        } else {
            setOfficesData(offices);
        }
    }, [companies, offices,apiUrl]);


    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            navigate('/employees'); // Redirect on success
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2>Create Employee</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={employee.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={employee.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={employee.phone} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="company">
                    <Form.Label>Company</Form.Label>
                    <Form.Control as="select" name="companyId" value={employee.companyId} onChange={handleChange} required>
                        <option value="">Select Company</option>
                        {companiesData.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="office">
                    <Form.Label>Office</Form.Label>
                    <Form.Control as="select" name="officeId" value={employee.officeId} onChange={handleChange} required>
                        <option value="">Select Office</option>
                        {officesData.map(office => (
                            <option key={office.id} value={office.id}>{office.location}</option>
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

export default CreateEmployeeForm;