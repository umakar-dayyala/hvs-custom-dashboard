import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`

export const getAlertData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getPopUpInfo`);
        return response.data.popup_view_data; 
    } catch (error) {
        console.error("Error fetching alert data:", error);
        return [];
    }
};
