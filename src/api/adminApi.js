import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/admin';

const adminApi = axios.create({
  baseURL: BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAdmins = async () => {
  try {
    const response = await adminApi.get('/admins');
    return response.data;  
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};


export const fetchStaffBySubject = async (subject) => {
  try {
    const encodedSubject = encodeURIComponent(subject);
    const response = await adminApi.get(`/staff-by-subject/${encodedSubject}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch staff for this subject'
    );
  }
};

export const fetchAdminById = async (adminId) => {
  try {
    const response = await adminApi.get(`/admins/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    throw error;
  }
};

export const fetchPendingRequests = async () => {
  try {
    const response = await adminApi.get('/pending-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};


export default adminApi;