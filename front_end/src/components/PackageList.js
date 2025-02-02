import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
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
                deliveryStatus: pkg.delivery_status,
                deliveryDate: pkg.delivery_date, 
                registeredByID: pkg.registered_by,
                registeredBy: pkg.registered_by_navigation,
                courrierID: pkg.courrier_id,
                courrier: pkg.courrier_navigation,
                officeAcceptedAtID: pkg.office_accepted_at,
                officeAcceptedAt: pkg.office_accepted_at_navigation,
                deliveryLocation: pkg.delivery_location,
                officeDeliveredAtID: pkg.office_delivered_at,
                officeDeliveredAt: pkg.office_delivered_at_navigation,
                companyID: pkg.company_id,
                company: pkg.company_navigation,
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
                        <th>Price</th> {}
                        <th>Delivery Status</th>
                        <th>Delivery Date</th> {}
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
                            <td>{pkg.price}</td> {}
                            <td>{pkg.deliveryStatus}</td>
                            <td>{pkg.deliveryDate}</td> {}
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