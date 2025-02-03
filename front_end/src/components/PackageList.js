import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Button, Dropdown } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function PackageList({ packages: initialPackages }) {
    const [packages, setPackages] = useState(initialPackages || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const apiUrl = getApiUrl();

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/api/v1/package`, { headers: getAuthHeaders() });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const packagesData = await response.json();

            const remappedPackages = packagesData.map(pkg => ({
                id: pkg.id,
                senderID: pkg.sender_id,
                sender: pkg.sender,
                receiverID: pkg.receiver_id,
                receiver: pkg.receiver,
                weight: pkg.weight,
                price: pkg.price,
                isDeliveredToOffice: pkg.is_delivered_to_office,
                deliveryStatus: pkg.deliveryStatus,
                deliveryDate: pkg.deliveryDate,
                registeredByID: pkg.registered_by,
                registeredBy: pkg.registeredBy,
                courrierID: pkg.courrier_id,
                courrier: pkg.courrier,
                officeAcceptedAtID: pkg.officeAcceptedAt?.ID,
                officeAcceptedAt: pkg.officeAcceptedAt,
                deliveryLocation: pkg.deliveryLocation,
                officeDeliveredAtID: pkg.office_delivered_at?.ID,
                officeDeliveredAt: pkg.officeDeliveredAt,
                companyID: pkg.company_id,
                company: pkg.company,
            }));

            setPackages(remappedPackages);

        } catch (error) {
            console.error("Error fetching packages:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages, refreshTrigger]);

    const handleRefreshClick = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleStatusChange = async (pkgId, newStatus) => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/package/${pkgId}`, {
                method: 'PATCH',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deliveryStatus: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setRefreshTrigger(prev => prev + 1); // Trigger refresh after successful update

        } catch (error) {
            console.error("Error updating status:", error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return (
            <>
                <Alert variant="danger">{error}</Alert>
                <Button onClick={handleRefreshClick}>Refresh Packages</Button>
            </>
        );
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Weight</th>
                        <th>Price</th>
                        <th>Delivery Status</th>
                        <th>Delivery Date</th>
                        <th>Delivery Location</th>
                        <th>Courier</th>
                        <th>Office Accepted At</th>
                        <th>Office Delivered At</th>
                        <th>Company</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map((pkg) => (
                        <tr key={pkg.id}>
                            <td>{pkg.id}</td>
                            <td>{pkg.sender?.name}</td>
                            <td>{pkg.receiver?.name}</td>
                            <td>{pkg.weight}</td>
                            <td>{pkg.price}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id={`dropdown-${pkg.id}`}>
                                        {pkg.deliveryStatus}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleStatusChange(pkg.id, 'Pending')}>
                                            Pending
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleStatusChange(pkg.id, 'In transit')}>
                                            In Transit
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleStatusChange(pkg.id, 'Delivered')}>
                                            Delivered
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>{pkg.deliveryDate}</td>
                            <td>{pkg.deliveryLocation}</td>
                            <td>{pkg.courrier?.name}</td>
                            <td>{pkg.officeAcceptedAt?.location}</td>
                            <td>{pkg.officeDeliveredAt?.location}</td>
                            <td>{pkg.company?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={handleRefreshClick}>Refresh Packages</Button>
        </div>
    );
}

export default PackageList;