import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://skillstack-learning-tracker-production.up.railway.app/api';

console.log('🔧 API Base URL:', API_BASE_URL); // Debug logging

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});


apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      if (error.response.status === 404) {
        console.error('Resource not found');
      } else if (error.response.status === 500) {
        console.error('Server error - please try again later');
      }
    } else if (error.request) {
      console.error('No response from server - check if backend is running');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getAllSkills = async (params) => {
  try {
    const response = await apiClient.get('skills/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};


export const getSkill = async (id) => {
  try {
    const response = await apiClient.get(`skills/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skill:', error);
    throw error;
  }
};


export const createSkill = async (skillData) => {
  try {
    const response = await apiClient.post('skills/', skillData);
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};


export const updateSkill = async (id, skillData) => {
  try {
    const response = await apiClient.put(`skills/${id}/`, skillData);
    return response.data;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};


export const deleteSkill = async (id) => {
  try {
    const response = await apiClient.delete(`skills/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};


export const getAIResources = async (id) => {
  try {
    console.log('🔄 Fetching AI resources for skill:', id);
    const response = await apiClient.post(`skills/${id}/ai-resources/`, {}, {
      timeout: 120000
    });
    console.log('✅ AI resources received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting AI resources:', error);
    throw error;
  }
};


export const getMasteryPrediction = async (id) => {
  try {
    console.log('🔄 Fetching mastery prediction for skill:', id);
    const response = await apiClient.post(`skills/${id}/mastery-predict/`, {}, {
      timeout: 120000
    });
    console.log('✅ Mastery prediction received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting mastery prediction:', error);
    throw error;
  }
};


export const getStreak = async () => {
  try {
    const response = await apiClient.get('profile/streak/');
    return response.data;
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};


export const updateStreak = async () => {
  try {
    const response = await apiClient.post('profile/update-streak/');
    return response.data;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};


export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('dashboard-stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};


export const getWeeklySummary = async () => {
  try {
    const response = await apiClient.post('weekly-summary/');
    // Mock email console log as per requirements
    console.log('📧 WEEKLY SUMMARY EMAIL');
    console.log('To: user@example.com');
    console.log('Subject: Your Weekly Learning Summary');
    console.log('---');
    console.log(response.data);
    console.log('---');
    
    return response.data;
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    throw error;
  }
};

export default apiClient;
