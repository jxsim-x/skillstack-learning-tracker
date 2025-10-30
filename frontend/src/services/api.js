import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
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


export const getAllSkills = async (params = {}) => {
  try {
    const response = await apiClient.get('skills/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

/**

 * @param {number} id 
 * @returns {Promise} 
 */
export const getSkill = async (id) => {
  try {
    const response = await apiClient.get(`skills/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skill:', error);
    throw error;
  }
};

/**

 * @param {Object} skillData 
 * @returns {Promise} 
 */
export const createSkill = async (skillData) => {
  try {
    const response = await apiClient.post('skills/', skillData);
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};

/**
 
 * @param {number} id - Skill ID
 * @param {Object} skillData - Updated skill data
 * @returns {Promise}
 */
export const updateSkill = async (id, skillData) => {
  try {
    const response = await apiClient.put(`skills/${id}/`, skillData);
    return response.data;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

/**
 * @param {number} id - Skill ID
 * @returns {Promise} Empty response
 */
export const deleteSkill = async (id) => {
  try {
    const response = await apiClient.delete(`skills/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

/**
 * Get AI-powered resource recommendations for a skill
 * @param {number} id - Skill ID
 * @returns {Promise} Resource recommendations
 */
export const getAIResources = async (id) => {
  try {
    const response = await apiClient.post(`skills/${id}/ai-resources/`);
    return response.data;
  } catch (error) {
    console.error('Error getting AI resources:', error);
    throw error;
  }
};

/**
 * Get AI mastery prediction for a skill
 * @param {number} id - Skill ID
 * @returns {Promise} Mastery prediction data
 */
export const getMasteryPrediction = async (id) => {
  try {
    const response = await apiClient.post(`skills/${id}/mastery-predict/`);
    return response.data;
  } catch (error) {
    console.error('Error getting mastery prediction:', error);
    throw error;
  }
};

/**
 * Get current streak data
 * @returns {Promise} Streak data object
 */
export const getStreak = async () => {
  try {
    const response = await apiClient.get('profile/streak/');
    return response.data;
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};

/**
 * Update streak (called internally when skills are modified)
 * @returns {Promise} Updated streak data
 */
export const updateStreak = async () => {
  try {
    const response = await apiClient.post('profile/update-streak/');
    return response.data;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise} Dashboard stats object
 */
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('dashboard-stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Generate weekly summary
 * @returns {Promise} Weekly summary data
 */
export const getWeeklySummary = async () => {
  try {
    const response = await apiClient.post('weekly-summary/');
    
    // Mock email console log (as per requirements)
    console.log('===== WEEKLY SUMMARY EMAIL =====');
    console.log('To: user@example.com');
    console.log('Subject: Your Weekly Learning Summary');
    console.log('---');
    console.log(response.data);
    console.log('================================');
    
    return response.data;
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    throw error;
  }
};

export default apiClient;