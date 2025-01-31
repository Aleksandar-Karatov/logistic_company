export const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    } else {
        return {};
    }
};
export const getApiUrl = () => {
    return process.env.REACT_APP_API_URL;
  };