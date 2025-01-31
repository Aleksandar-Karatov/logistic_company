import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function OfficeList({ offices: initialOffices }) {
    const [offices, setOffices] = useState(initialOffices || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const apiUrl = getApiUrl();

    const fetchOffices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/api/v1/office`, { headers: getAuthHeaders() });
            if (!response.ok) {
                const errorData = await response.json(); // Try to parse error details
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const officesData = await response.json();
            const officesWithStringIds = officesData.map(office => ({
                ...office,
                id: String(office.id), // Convert ID to string
            }));
            setOffices(officesWithStringIds);
        } catch (error) {
            console.error("Error fetching offices:", error);
            setError(error.message); // Set the error message for display
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchOffices();
    }, [fetchOffices, refreshTrigger]); // refreshTrigger is a dependency now

    const handleRefreshClick = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return (
            <>
                <Alert variant="danger">{error}</Alert>
                <Button onClick={handleRefreshClick}>Refresh Offices</Button>
            </>
        );
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Location</th>
                        <th>Company ID</th>
                    </tr>
                </thead>
                <tbody>
                    {offices.map((office) => (
                        <tr key={office.id}>
                            <td>{office.id}</td>
                            <td>{office.location}</td>
                            <td>{office.companyID}</td>
                            <td>{office.company.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={handleRefreshClick}>Refresh Offices</Button>
        </div>
    );
}

export default OfficeList;