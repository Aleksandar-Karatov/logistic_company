import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';
import { useNavigate } from 'react-router-dom';

function CompanyList({ userRole }) {
    const [companyList, setCompanyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();
    const navigate = useNavigate();

    const fetchCompanies = useCallback(async () => {
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
    }, [apiUrl]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleRefresh = () => {
        fetchCompanies();
    };

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

    if (userRole === 'admin') {
        return (
            <div>
                <button onClick={handleRefresh} className="btn btn-primary mb-3">Refresh</button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            {}
                        </tr>
                    </thead>
                    <tbody>
                        {companyList.map((company) => (
                            <tr
                                key={company.id}
                                onClick={() => navigate(`/company/${company.id}/employees`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{company.id}</td>
                                <td>{company.name}</td>
                                {}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    } else {
        return <Alert variant="info">This list is only accessible to administrators.</Alert>;
    }
}

export default CompanyList;