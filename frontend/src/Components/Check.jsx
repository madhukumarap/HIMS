import { useEffect } from "react";
import extractRoleFromToken from "./extractRoleFromToken";
import AuthService from '../services/auth.service';

//<Sidebar sidebarOpen={showSidebar} toggleSidebar={toggleSidebar2} />
// const toggleSidebar2 = () => {
// setShowSidebar(!showSidebar);
//   };
//  const [showSidebar, setShowSidebar] = useState(false);


const MyComponent = () => {
    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        const token = currentUser.Token;
        // Get the token from wherever you have stored it
        // const token = localStorage.getItem("Token");

        alert(token)
        // Extract the role from the token
        const role = extractRoleFromToken(token);

        // Do something with the role
        alert(role)
        console.log("Role:", role);
    }, []);

    return <div>Component content</div>;
};

export default MyComponent;
