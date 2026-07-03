import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_API_KEY,
  }
});