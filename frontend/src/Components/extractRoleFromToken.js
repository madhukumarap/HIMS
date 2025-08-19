

import { jwt } from "crypto-js";

const extractRoleFromToken = (token) => {
    try {

        // Decode the token
        const decodedToken = jwt.decode(token);

        // Access the role claim from the decoded token
        const role = decodedToken.role;

        return role;
    } catch (error) {
        console.error("Error extracting role from token:", error);
        return null;
    }
};

export default extractRoleFromToken;
