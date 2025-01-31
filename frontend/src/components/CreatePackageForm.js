import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { getAuthHeaders } from './utils';

function CreatePackageForm({ companies, clients, offices, employees }) {
    const [formData, setFormData] = useState({
        senderID: '',
        receiverID: '',
        weight: '',
        isDeliveredToOffice: true,
        deliveryLocation: '',
        officeAcceptedAtID: '',
        officeDeliveredAtID: '',
        companyID: '',
        courrierID: '',
        registeredByID: '',
        deliveryStatus: 'Pending',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/v1/package', {
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

            setSuccess("Package created successfully!");
            setFormData({ // Reset the form
                senderID: '',
                receiverID: '',
                weight: '',
                isDeliveredToOffice: true,
                deliveryLocation: '',
                officeAcceptedAtID: '',
                officeDeliveredAtID: '',
                companyID: '',
                courrierID: '',
                registeredByID: '',
                deliveryStatus: 'Pending',
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
            <h2>Create Package</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="senderID">
                    <Form.Label>Sender</Form.Label>
                    <Form.Control as="select" name="senderID" value={formData.senderID} onChange={handleChange} required>
                        <option value="">Select Sender</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="receiverID">
                    <Form.Label>Receiver</Form.Label>
                    <Form.Control as="select" name="receiverID" value={formData.receiverID} onChange={handleChange} required>
                        <option value="">Select Receiver</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="weight">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type="number" name="weight" value={formData.weight} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="isDeliveredToOffice">
                    <Form.Check 
                        type="checkbox" 
                        label="Deliver to Office" 
                        name="isDeliveredToOffice" 
                        checked={formData.isDeliveredToOffice} 
                        onChange={handleChange} 
                    />
                </Form.Group>

                <Form.Group controlId="deliveryLocation">
                    <Form.Label>Delivery Location</Form.Label>
                    <Form.Control type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="officeAcceptedAtID">
                    <Form.Label>Office Accepted At</Form.Label>
                    <Form.Control as="select" name="officeAcceptedAtID" value={formData.officeAcceptedAtID} onChange={handleChange} required>
                        <option value="">Select Office</option>
                        {offices.map(office => (
                            <option key={office.id} value={office.id}>{office.location}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="officeDeliveredAtID">
                    <Form.Label>Office Delivered At</Form.Label>
                    <Form.Control as="select" name="officeDeliveredAtID" value={formData.officeDeliveredAtID} onChange={handleChange} required>
                        <option value="">Select Office</option>
                        {offices.map(office => (
                            <option key={office.id} value={office.id}>{office.location}</option>
                        ))}
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

                <Form.Group controlId="courrierID">
                    <Form.Label>Courier</Form.Label>
                    <Form.Control as="select" name="courrierID" value={formData.courrierID} onChange={handleChange} required>
                        <option value="">Select Courier</option>
                        {employees.filter(employee => employee.role === "courier").map(employee => (
                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="registeredByID">
                    <Form.Label>Registered By</Form.Label>
                    <Form.Control as="select" name="registeredByID" value={formData.registeredByID} onChange={handleChange} required>
                        <option value="">Select Employee</option>
                        {employees.filter(employee => employee.role !== "courier").map(employee => (
                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="deliveryStatus">
                    <Form.Label>Delivery Status</Form.Label>
                    <Form.Control as="select" name="deliveryStatus" value={formData.deliveryStatus} onChange={handleChange} required>
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">Create Package</Button>
            </Form>
        </Container>
    );
}

export default CreatePackageForm;