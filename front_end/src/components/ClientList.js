import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function ClientList({ clients: initialClients }) {
    const [clients, setClients] = useState(initialClients || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // For refresh button

    const apiUrl = getApiUrl();

    const fetchClients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/api/v1/client`, { headers: getAuthHeaders() });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const clientsData = await response.json();
            setClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients, refreshTrigger]); // refreshTrigger is a dependency

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
                <Button onClick={handleRefreshClick}>Refresh Clients</Button>
            </>
        );
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        {/* ... other columns */}
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{client.phone}</td>
                            {/* ... other cells */}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={handleRefreshClick}>Refresh Clients</Button>
        </div>
    );
}

export default ClientList;