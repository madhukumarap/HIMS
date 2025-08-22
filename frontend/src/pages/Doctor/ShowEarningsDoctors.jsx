import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";

const ShowEarningsDoctors = () => {
  const currentUser = AuthService.getCurrentUser();
  const [doctorList, setDoctorList] = useState([]);

  const user_Email = currentUser && currentUser.email;

  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getDoctors`,
        {
          headers: {
            Authorization: `${currentUser?.Token}`,
          },
        }
      );
      setDoctorList(response.data);
    } catch (error) {
      console.log("Error fetching doctor list:", error);
    }
  };

  const current_user = doctorList.filter((item) => {
    return item.email === user_Email;
  });

  console.log(current_user);
  

  return <div>ShowEarningsDoctors</div>;
};

export default ShowEarningsDoctors;
