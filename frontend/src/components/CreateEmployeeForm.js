import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { getAuthHeaders } from './utils';

function CreateEmployeeForm({ companies }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        companyID: '',
        password: '', // Include password field
        officeID: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await fetch('/api/v1/office', { headers: getAuthHeaders() });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOffices(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/v1/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setSuccess("Employee created successfully!");
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: '',
                companyID: '',
                password: '',
                officeID: '',
            });
        } catch (err) {
            setError(err.message);
        } finally {
          setLoading(false);
        }
    };

    if (loading) return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (success) return <Alert variant="success">{success}</Alert>;

    return (
        <Container>
            <h2>Create Employee</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Control as="select" name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="office">Office Employee</option>
                        <option value="courier">Courier</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="companyID">
                    <Form.Label>Company</Form.Label>
                    <Form.Control as="select" name="companyID" value={formData.companyID} onChange={handleChange} required>
                        <option value="">Select Company</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="officeID">
                    <Form.Label>Office</Form.Label>
                    <Form.Control as="select" name="officeID" value={formData.officeID} onChange={handleChange}>
                        <option value="">Select Office (Optional)</option>
                        {offices.map(office => (
                            <option key={office.id} value={office.id}>{office.location}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit">Create Employee</Button>
            </Form>
        </Container>
    );
}

export default CreateEmployeeForm;