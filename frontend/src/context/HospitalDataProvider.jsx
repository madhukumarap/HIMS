import { createContext, useEffect } from "react";
import { useState, useContext } from "react";
import axios from "axios";
import AuthService from "../services/auth.service";

export const HospitalContext = createContext();

export default function HospitalProvider({ children }) {
  const [hospitalData, setHospitalData] = useState({});

  async function fetchHospitalData() {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (currentUser) {
        const token = currentUser.Token;

        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));

        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const REMOTE_URL = `${API_BASE_URL}/api/getHospital/${payload.hospitalID}`;

        const res = await axios.get(REMOTE_URL, {
          headers: {
            Authorization: currentUser?.Token,
          },
        });

        setHospitalData(res.data.data);
      }
    } catch (error) {
      console.error("Hospital data provider: ", error);
    }
  }

  useEffect(() => {
    fetchHospitalData();
  }, []);
  return (
    <HospitalContext.Provider
      value={{
        hospitalData,
        setHospitalData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}
