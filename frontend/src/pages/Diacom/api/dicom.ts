import axios from 'axios';
// import { BSE_URL } from '../Constant';

// const API_URL =  `${BSE_URL}/api/dicom`;

const getToken = () => localStorage.getItem('xpert_token');

export const getDicomFiles = () => {
  return axios.get(import.meta.env.VITE_API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const uploadDicomFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${import.meta.env.VITE_API_URL}/api/dicom/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
