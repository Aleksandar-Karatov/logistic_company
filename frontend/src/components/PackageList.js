import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Alert, Spinner, Form } from 'react-bootstrap';
import { getAuthHeaders } from './utils';

function PackageList({ userRole, senderId }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState(''); // State for status filter
    const [filterSender, setFilterSender] = useState('');
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true);
            try {
                let url = '/api/v1/package';

                if (userRole === 'client' && senderId) {
                    url = `/api/v1/package/sender/${senderId}`;
                }

                const response = await fetch(url, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPackages(data);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchClients = async () => {
            try {
              const clientsResponse = await fetch('/api/v1/client', { headers: getAuthHeaders() });
              if (!clientsResponse.ok) throw new Error("Failed to fetch clients");
              const clientsData = await clientsResponse.json();
              setClients(clientsData);
            } catch (err) {
              setError(err.message);
            }
        };

        fetchPackages();
        if(userRole !== 'client') {
            fetchClients();
        }
    }, [userRole, senderId]);

    const filteredPackages = packages.filter(pack => {
        const statusMatch = filterStatus === '' || pack.deliveryStatus === filterStatus;
        const senderMatch = filterSender === '' || pack.senderID === filterSender;
        return statusMatch && senderMatch;
    });

    if (loading) return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <Container>
            <h2>Packages</h2>

            {/* Status Filter */}
            <Form.Group controlId="filterStatus">
                <Form.Label>Filter by Status:</Form.Label>
                <Form.Control as="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    {/* Add more statuses as needed */}
                </Form.Control>
            </Form.Group>

            {userRole !== 'client' && (
                <Form.Group controlId="filterSender">
                    <Form.Label>Filter by Sender:</Form.Label>
                    <Form.Control as="select" value={filterSender} onChange={e => setFilterSender(e.target.value)}>
                        <option value="">All</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            )}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Weight</th>
                        <th>Delivery Status</th>
                        <th>Company</th>
                        <th>Delivery Location</th>
                        <th>Office Accepted At</th>
                        <th>Office Delivered At</th>
                        <th>Courier</th>
                        <th>Registered By</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPackages.map(pack => (
                        <tr key={pack.id}>
                            <td>{pack.id}</td>
                            <td>{pack.sender?.name}</td>
                            <td>{pack.receiver?.name}</td>
                            <td>{pack.weight}</td>
                            <td>{pack.deliveryStatus}</td>
                            <td>{pack.company?.name}</td>
                            <td>{pack.deliveryLocation}</td>
                            <td>{pack.officeAcceptedAt?.location}</td>
                            <td>{pack.officeDeliveredAt?.location}</td>
                            <td>{pack.courrier?.name}</td>
                            <td>{pack.registeredBy?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default PackageList;