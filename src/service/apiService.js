import axios from 'axios';
import config from '../config/config';

const apiService = axios.create({
  baseURL: config.API.URL,
  timeout: config.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiService.interceptors.response.use(
  response => response, // Return the response if no error
  error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized, redirecting to login...');
      localStorage.removeItem('token'); // Remove the token
      // This can be modified based on your routing version
      window.location.href = '/Login'; // Redirect to the login page
    }
    return Promise.reject(error); // Reject the error for further handling
  }
);

export const login = async (userId, password) => {

    
  try {
    const response = await apiService.post(config.API.ENDPOINTS.LOGIN, { username: userId, password: password});
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      // apiService.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      console.log('Token after login:', localStorage.getItem('token')); // Verify token immediately after setting
    }
    console.log("logged in");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getQueries = async (limit = 5) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiService.post('/query/get', null, {
      params: { limit },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchQueries = async (query) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log(query);
    const requestBody = { query }; // Ensure it is an object
    console.log("Sending search request with:", requestBody);

    const response = await apiService.post(`/query/search`, query, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error in searchQueries:", error);
    throw error.response?.data || error.message;
  }
};

export const previewDataset = async (title) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log(title);

    const response = await apiService.post(`/query/preview`, null, {
      params: { tableName: title },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error in searchQueries:", error);
    throw error.response?.data || error.message;
  }
};

export const fullData = async (title) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log(title);

    const response = await apiService.post(`/query/fulltable`, null, {
      params: { tableName: title },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error in fetching full data", error);
    throw error.response?.data || error.message;
  }
};

export const geoJsonData = async (title) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log(title);

    const response = await apiService.post(`/query/getgeojson`, null, {
      params: { tableName: title },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error in fetching geojsondata data", error);
    throw error.response?.data || error.message;
  }
};


export default apiService;