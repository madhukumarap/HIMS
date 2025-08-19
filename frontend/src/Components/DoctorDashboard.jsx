import React from 'react';
import AuthService from '../services/auth.service';

const DoctorDashboard = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.roles.includes('ROLE_DOCTOR')) {
        // If the user is not logged in or does not have the doctor role,
        // you can show a message or redirect to another page.
        return <p>You are not authorized to access this page.</p>;
    }

    return (
        <div className="col-md-12">
            <h2>Doctor Dashboard</h2>
            <p>Welcome to the doctor dashboard! Here, you can manage your appointments, patients, and medical records.</p>
            {/* Add your doctor-specific dashboard content and functionality */}
        </div>
    );
};

export default DoctorDashboard;
