import axios from 'axios';
import { BSE_URL } from '../Constant';

const API_URL = `${BSE_URL}/api/auth`;

export const register = (data: any) => {
  return axios.post(`${API_URL}/register`, data);
};

export const login = (data: any) => {
  return axios.post(`${API_URL}/login`, data);
};
