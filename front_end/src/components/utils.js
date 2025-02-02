export const handleLogout = async (apiUrl) => {
    try {
        const response = await fetch(`${apiUrl}/api/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        localStorage.removeItem('jwtToken');
    } catch (error) {
        console.error("Logout error:", error);
        throw error; 
    }
};
export const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken'); 
    if (token) {
        return {
            'Authorization': `${token}`, 
            'Content-Type': 'application/json'
        };
    } else {
        return {};
    }
};

export const getApiUrl = () => {
  return process.env.REACT_APP_API_URL;
};