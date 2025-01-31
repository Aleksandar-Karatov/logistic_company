import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getAuthHeaders, getApiUrl } from './utils';
import { Link } from 'react-router-dom';

function CompanyList({ companies }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [companiesData, setCompaniesData] = useState(companies || []); // Correct
    const apiUrl = getApiUrl(); 

    useEffect(() => {
        if (!companies) { // Only fetch if companies prop is not provided
            const fetchCompanies = async () => {
                setLoading(true);
                setError(null);
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
                } finally {
                    setLoading(false);
                }
            };

            fetchCompanies();
        } else {
            setCompaniesData(companies); // Use the companies prop if available
        }
    }, [companies,apiUrl]);


    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Company List</h2>
            <Link to="/create-company" className="btn btn-primary mb-3">Create Company</Link>
            {companiesData.length > 0? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            {/* Add other relevant columns */}
                            <th>Actions</th> {/* Add actions column */}
                        </tr>
                    </thead>
                    <tbody>
                        {companiesData.map(company => (
                            <tr key={company.id}>
                                <td>{company.id}</td>
                                <td>{company.name}</td>
                                <td>{company.address}</td>
                                {/* Add other table cells */}
                                <td>
                                    <Button variant="primary" size="sm" as={Link} to={`/companies/${company.id}`}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => {/* Implement delete logic */ }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ): (
                <p>No companies found.</p>
            )}
        </div>
    );
}

export default CompanyList;