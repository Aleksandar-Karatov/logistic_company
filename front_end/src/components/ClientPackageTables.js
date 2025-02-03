import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { getAuthHeaders, getApiUrl } from './utils';

function ClientPackageTables({ userRole, userId }) {
    const [sentPackages, setSentPackages] = useState([]);
    const [receivedPackages, setReceivedPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const sentResponse = await fetch(`${apiUrl}/api/v1/package/sender/${userId}`, { headers: getAuthHeaders() });
                if (!sentResponse.ok) {
                    const errorData = await sentResponse.json();
                    throw new Error(errorData.message || `HTTP error! status: ${sentResponse.status}`);
                }
                const sentData = await sentResponse.json();
                setSentPackages(sentData.map(pkg => ({
                    ...pkg,
                    sender: pkg.sender,
                    receiver: pkg.receiver,
                    officeAcceptedAt: pkg.officeAcceptedAt,
                    officeDeliveredAt: pkg.officeDeliveredAt,
                    company: pkg.company
                })));

                const receivedResponse = await fetch(`${apiUrl}/api/v1/package/receiver/${userId}`, { headers: getAuthHeaders() });
                if (!receivedResponse.ok) {
                    const errorData = await receivedResponse.json();
                    throw new Error(errorData.message || `HTTP error! status: ${receivedResponse.status}`);
                }
                const receivedData = await receivedResponse.json();
                setReceivedPackages(receivedData.map(pkg => ({
                    ...pkg,
                    sender: pkg.sender,
                    receiver: pkg.receiver,
                    officeAcceptedAt: pkg.officeAcceptedAt,
                    officeDeliveredAt: pkg.officeDeliveredAt,
                    company: pkg.company
                })));

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) { 
            fetchPackages();
        } else {
          setLoading(false); 
        }
    }, [userId, apiUrl]); 

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Sent Packages</h2>
            {sentPackages.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Weight</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Delivery Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sentPackages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.weight}</td>
                                <td>{pkg.sender?.name}</td>
                                <td>{pkg.receiver?.name}</td>
                                <td>{pkg.deliveryLocation}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No sent packages found.</p>
            )}

            <h2>Received Packages</h2>
            {receivedPackages.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Weight</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Delivery Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receivedPackages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.weight}</td>
                                <td>{pkg.sender?.name}</td>
                                <td>{pkg.receiver?.name}</td>
                                <td>{pkg.deliveryLocation}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No received packages found.</p>
            )}
        </div>
    );
}

export default ClientPackageTables;