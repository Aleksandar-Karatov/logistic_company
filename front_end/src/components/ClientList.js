// src/components/ClientList.js
import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getAuthHeaders, getApiUrl } from './utils';
import { Link } from 'react-router-dom';

function ClientList({ clients }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientsData, setClientsData] = useState(clients || []);
    const apiUrl= getApiUrl();
    useEffect(() => {
        if (!clients) {
            const fetchClients = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${apiUrl}/api/v1/client`, { headers: getAuthHeaders() });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setClientsData(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchClients();
        } else {
            setClientsData(clients);
        }
    }, [clients, apiUrl]);

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Client List</h2>
            <Link to="/create-client" className="btn btn-primary mb-3">Create Client</Link>
            {clientsData.length > 0? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientsData.map(client => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>{client.company?.name}</td> {/* Assuming company is a related object */}
                                <td>
                                    <Button variant="primary" size="sm" as={Link} to={`/clients/${client.id}`}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => {/* Implement delete logic */ }}>Delete</Button>
                                                        </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ): (
                <p>No clients found.</p>
            )}
        </div>
    );
}

export default ClientList;