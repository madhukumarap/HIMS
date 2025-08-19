import axios from "axios";
import { AES, enc, SHA256 } from "crypto-js";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/`;
const SECRET_KEY = "your-secret-key";
class AuthService {
  encryptData(data) {
    const encryptedData = AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    return encryptedData;
  }

  decryptData(encryptedData) {
    const decryptedData = AES.decrypt(encryptedData, SECRET_KEY).toString(
      enc.Utf8
    );
    return JSON.parse(decryptedData);
  }

  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.Token) {
          localStorage.setItem("token", response.data.Token);
          const encryptedUser = this.encryptData(response.data);
          const checksum = SHA256(encryptedUser).toString();
          localStorage.setItem("user", encryptedUser);
          localStorage.setItem("checksum", checksum);
          // alert(response.data.Token);
        }
        return response.data;
      });
  }

  logout() {
    toast.info("Logout in progress... Please wait!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("reloadCount2");
    localStorage.removeItem("reloadCount1");
    localStorage.removeItem("checksum");
    const logoutURL =
      import.meta.env.MODE === "production"
        ? "https://silfratech.in/mediai/login"
        : "/login";
    window.location.replace(logoutURL);
    toast.dismiss();
  }

  register(name, username, email, phoneNumber, password, roles) {
    return axios.post(API_URL + "signup", {
      name,
      username,
      email,
      phoneNumber,
      password,
      roles,
    });
  }

  getCurrentUser() {
    const encryptedUser = localStorage.getItem("user");
    const storedChecksum = localStorage.getItem("checksum");
    if (encryptedUser && storedChecksum) {
      try {
        const decryptedUser = this.decryptData(encryptedUser);
        const calculatedChecksum = SHA256(encryptedUser).toString();
        if (calculatedChecksum === storedChecksum) {
          return decryptedUser;
        } else {
          console.log("Data integrity compromised. Logging out user...");
          this.logout();
        }
      } catch (error) {
        console.log("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("checksum");
      }
    }
    return null;
  }
}

export default new AuthService();
