import axios from 'axios';
// import { BSE_URL } from '../Constant';

// const API_URL =  `${BSE_URL}/api/dicom`;
import AuthService from "../../../services/auth.service";

const currentUser = AuthService.getCurrentUser();

export const getDicomFiles = (patientId = null, testBookingID = null) => {
  const currentUser = AuthService.getCurrentUser();
  const params = {};
  
  if (patientId) {
    params.patientId = patientId;
  }
  
  if (testBookingID) {
    params.testBookingID = testBookingID;
  }

  return axios.get(`${import.meta.env.VITE_API_URL}/api/getDicom`, {
    params, // Add both patientId and testBookingID as query parameters
    headers: { 
      Authorization: `${currentUser?.Token}`,
    },
  });
};

export const getReportedDicomFiles = (email:string) => {
  const currentUser = AuthService.getCurrentUser();
  const params = {};
  if(email){
    params.email = email
  }
  return axios.get(`${import.meta.env.VITE_API_URL}/api/getReportedDicom`, {
    params, // Add both patientId and testBookingID as query parameters
    headers: { 
      Authorization: `${currentUser?.Token}`,
    },
  });
};

export const uploadDicomFile = (formData) => {

  return axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${currentUser?.Token}`,
    },
  });
};
