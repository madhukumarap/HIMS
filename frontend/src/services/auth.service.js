import axios from "axios";
import { AES, enc, SHA256 } from "crypto-js";
import { toast } from "react-toastify";

const currentPath = window.location.pathname;
const parts = currentPath.split("/");
const matchResult = currentPath.match(/mediai\/([^\/]+)/);
let extractedPart;
if (matchResult && matchResult[1]) {
  extractedPart = matchResult[1];
  console.log(extractedPart);
}
const API_URL = `${import.meta.env.VITE_API_URL}/${extractedPart}/api/auth/`;
const API_URL_Signup = `${
  import.meta.env.VITE_API_URL
}/api/${extractedPart}/auth/`;

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
          sessionStorage.setItem("token", response.data.Token);
          const encryptedUser = this.encryptData(response.data);
          const checksum = SHA256(encryptedUser).toString();
          sessionStorage.setItem("user", encryptedUser);
          sessionStorage.setItem("checksum", checksum);
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

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("reloadCount2");
    sessionStorage.removeItem("reloadCount1");
    sessionStorage.removeItem("checksum");
    const logoutURL =
      import.meta.env.MODE === "production"
        ? "https://silfratech.in/mediai/login"
        : "/login";
    window.location.replace(logoutURL);
    toast.dismiss();
  }

  register(name, username, email, phoneNumber, password, roles, countryCode) {
    return axios.post(API_URL_Signup + "signupUI", {
      name,
      username,
      email,
      phoneNumber,
      password,
      roles,
      countryCode,
      Client: extractedPart,
    });
  }

  getCurrentUser() {
    const encryptedUser = sessionStorage.getItem("user");
    const storedChecksum = sessionStorage.getItem("checksum");
    if (encryptedUser && storedChecksum) {
      try {
        const decryptedUser = this.decryptData(encryptedUser);
        const calculatedChecksum = SHA256(encryptedUser).toString();
        if (calculatedChecksum === storedChecksum) {
          // console.log("User data is valid and decrypted successfully.",decryptedUser);
          return decryptedUser;
        } else {
          console.log("Data integrity compromised. Logging out user...");
          this.logout();
        }
      } catch (error) {
        console.log("Error parsing user data:", error);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("checksum");
      }
    }
    return null;
  }
}

export default new AuthService();
