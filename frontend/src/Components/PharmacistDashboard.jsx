import React from 'react';
import AuthService from '../services/auth.service';

const PharmacistDashboard = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.roles.includes('ROLE_PHARMACIST')) {
        // If the user is not logged in or does not have the pharmacist role,
        // you can show a message or redirect to another page.
        return "Access Denied";
    }

    return (
        <div>
            "Access Denied";
            {/* Add your pharmacist-specific dashboard content here */}
        </div>
    );
};

export default PharmacistDashboard;
