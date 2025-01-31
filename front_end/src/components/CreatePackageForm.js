import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, getAuthHeaders } from './utils';

function CreatePackageForm({ companies, clients, offices, employees }) {
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState({
        weight: '',
        senderId: '',
        receiverId: '',
        deliveryAddress: '',
        officeId: '',
        deliveryType: 'address',
        employeeId: '',
        companyId: '', // Add companyId to packageData
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companiesData, setCompaniesData] = useState(companies || []);
    const [clientsData, setClientsData] = useState(clients || []);
    const [officesData, setOfficesData] = useState(offices || []);
    const [employeesData, setEmployeesData] = useState(employees || []);
    const apiUrl = getApiUrl();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchCalls = [];

                if (!companies) {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/company`, { headers: getAuthHeaders() }).then(res => res.json()));
                }
                if (!clients) {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/client`, { headers: getAuthHeaders() }).then(res => res.json()));
                }
                if (!offices) {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/office`, { headers: getAuthHeaders() }).then(res => res.json()));
                }
                if (!employees) {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/employee`, { headers: getAuthHeaders() }).then(res => res.json()));
                }

                const results = await Promise.all(fetchCalls);

                if (!companies) setCompaniesData(results[0] || []);
                if (!clients) setClientsData(results[1] || []);
                if (!offices) setOfficesData(results[2] || []);
                if (!employees) setEmployeesData(results[3] || []);

            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [companies, clients, offices, employees, apiUrl]);

    const handleChange = (e) => {
        setPackageData({ ...packageData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/package`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(packageData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            navigate('/packages');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2>Create Package</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>

                <Form.Group controlId="weight">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type="number" name="weight" value={packageData.weight} onChange={handleChange} required />
                </Form.Group>

                <Form.Group controlId="company"> {/* Added Company selection */}
                    <Form.Label>Company</Form.Label>
                    <Form.Control as="select" name="companyId" value={packageData.companyId} onChange={handleChange} required>
                        <option value="">Select Company</option>
                        {companiesData.map(company => (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="sender">
                    <Form.Label>Sender</Form.Label>
                    <Form.Control as="select" name="senderId" value={packageData.senderId} onChange={handleChange} required>
                        <option value="">Select Sender</option>
                        {clientsData.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="receiver">
                    <Form.Label>Receiver</Form.Label>
                    <Form.Control as="select" name="receiverId" value={packageData.receiverId} onChange={handleChange} required>
                        <option value="">Select Receiver</option>
                        {clientsData.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="deliveryAddress">
                    <Form.Label>Delivery Address</Form.Label>
                    <Form.Control type="text" name="deliveryAddress" value={packageData.deliveryAddress} onChange={handleChange} required={packageData.deliveryType === 'address'} />
                </Form.Group>

                <Form.Group controlId="office">
                    <Form.Label>Office (for office delivery)</Form.Label>
                    <Form.Control as="select" name="officeId" value={packageData.officeId} onChange={handleChange} required={packageData.deliveryType === 'office'}>
                        <option value="">Select Office</option>
                        {officesData.map(office => (
                            <option key={office.id} value={office.id}>{office.location}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Delivery Type</Form.Label>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            label="Address"
                            name="deliveryType"
                            value="address"
                            checked={packageData.deliveryType === 'address'}
                            onChange={handleChange}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="Office"
                            name="deliveryType"
                            value="office"
                            checked={packageData.deliveryType === 'office'}
                            onChange={handleChange}
                        />
                    </div>
                </Form.Group>

                <Form.Group controlId="employee">
                    <Form.Label>Employee (Courier)</Form.Label>
                    <Form.Control as="select" name="employeeId" value={packageData.employeeId} onChange={handleChange} required>
                        <option value="">Select Employee</option>
                        {employeesData.map(employee => (
                            <option key={employee.id} value={employee.id}>{employee.name}</option>
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

export default CreatePackageForm;