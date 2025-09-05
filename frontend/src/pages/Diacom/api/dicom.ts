import axios from 'axios';
// import { BSE_URL } from '../Constant';

// const API_URL =  `${BSE_URL}/api/dicom`;
import AuthService from "../../../services/auth.service";

const currentUser = AuthService.getCurrentUser();

const getToken = () => localStorage.getItem('xpert_token');


// export const getDicomFiles = () => {
//   return axios.get(`${import.meta.env.VITE_API_URL}/api/getDicom`, {
//     headers: { Authorization: `${currentUser?.Token}`, },
//   });
// };

// api/dicom.js
export const getDicomFiles = (patientId = null) => {
  const currentUser = AuthService.getCurrentUser();
  const params = {};
  
  if (patientId) {
    params.patientId = patientId;
  }

  return axios.get(`${import.meta.env.VITE_API_URL}/api/getDicom`, {
    params, // Add patientId as query parameter
    headers: { 
      Authorization: `${currentUser?.Token}`,
    },
  });
};

export const uploadDicomFile = (formData) => {

  return axios.post(`${import.meta.env.VITE_API_URL}/api/dicom/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${currentUser?.Token}`,
    },
  });
};
