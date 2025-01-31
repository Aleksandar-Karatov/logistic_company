// utils.js
export const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiError = async (response) => {
    if (!response.ok) {
        const errorData = await response.json(); // Try to parse JSON error response
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`); // Use message from API or generic
    }
    return response; // Return the response if OK
};
