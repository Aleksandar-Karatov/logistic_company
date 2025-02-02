import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function CreateEmployeeForm() {
    const [name, setName] = useState('');
    const [role, setRole] = useState('employee');
    const [companyId, setCompanyId] = useState('');
    const [officeId, setOfficeId] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [companyOffices, setCompanyOffices] = useState([]);
    const [officesLoading, setOfficesLoading] = useState(false);
    const apiUrl = getApiUrl();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/company`, { headers: getAuthHeaders() });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const companiesData = await response.json();
                setCompanies(companiesData);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError(err.message);
            }
        };

        fetchCompanies();
    }, [apiUrl]);

    useEffect(() => {
        const fetchCompanyOffices = async () => {
            if (companyId) {
                setOfficesLoading(true);
                setError(null);
                setCompanyOffices([]);

                try {
                    const response = await fetch(`${apiUrl}/api/v1/office/company/${companyId}`, { headers: getAuthHeaders() });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const officesData = await response.json();
                    setCompanyOffices(officesData);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setOfficesLoading(false);
                }
            } else {
                setCompanyOffices([]);
            }
        };

        fetchCompanyOffices();
    }, [companyId, apiUrl]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${apiUrl}/api/v1/employee`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name,
                    role,
                    email,
                    phone,
                    companyId,
                    officeId,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setSuccess(true);
            setName('');
            setRole('employee');
            setEmail('');
            setPhone('');
            setPassword('');
            setCompanyId('');
            setOfficeId('');
            setCompanyOffices([]);
        } catch (error) {
            console.error("Error creating employee:", error);
            setError(error.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Employee created successfully!</Alert>}

            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="tel" placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="employee">Employee</option>
                    <option value="courier">Courier</option>
                    <option value="admin">Admin</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="company">
                <Form.Label>Company</Form.Label>
                <Form.Control as="select" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="office">
                <Form.Label>Office</Form.Label>
                <Form.Control as="select" value={officeId} onChange={(e) => setOfficeId(e.target.value)} disabled={!companyId || officesLoading}>
                    <option value="">Select Office</option>
                    {officesLoading ? (
                        <option disabled>Loading...</option>
                    ) : companyOffices.length > 0 ? (
                        companyOffices.map((office) => (
                            <option key={office.id} value={office.id}>
                                {office.location}
                            </option>
                        ))
                    ) : (
                        <option disabled>No offices available</option>
                    )}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit">
                Create Employee
            </Button>
        </Form>
    );
}

export default CreateEmployeeForm;