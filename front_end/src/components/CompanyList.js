import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function CompanyList({ companies, userRole }) { // Add userRole prop
    const [companyList, setCompanyList] = useState(companies || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${apiUrl}/api/v1/company`, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setCompanyList(data);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (!companies) {
            fetchCompanies();
        } else {
            setLoading(false);
        }
    }, [apiUrl, companies]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    // Conditionally render the table only for admin
    if (userRole === 'admin') {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        {/* Add other table headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {companyList.map((company) => (
                        <tr key={company.id} onClick={() => navigate(`/company/${company.id}/employees`)} style={{ cursor: 'pointer' }}> {/* Make row clickable */}
                            <td>{company.id}</td>
                            <td>{company.name}</td>
                            {/* Add other table cells as needed */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    } else {
        return <Alert variant="info">This list is only accessible to administrators.</Alert>;
    }
}

export default CompanyList;