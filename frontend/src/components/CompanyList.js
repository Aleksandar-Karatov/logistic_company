import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Alert, Spinner } from 'react-bootstrap';
import { getAuthHeaders } from './utils';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/v1/company', {
                    headers: getAuthHeaders(),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCompanies(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <Container>
            <h2>Company List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company => (
                        <tr key={company.id}>
                            <td>{company.id}</td>
                            <td>{company.name}</td>
                            <td>{company.revenue}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default CompanyList;