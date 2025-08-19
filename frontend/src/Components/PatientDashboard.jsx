import React from 'react';
import AuthService from '../services/auth.service';

const PatientDashboard = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.roles.includes('ROLE_PATIENT')) {
        // If the user is not logged in or does not have the patient role,
        // you can show a message or redirect to another page.
        return <p>You are not authorized to access this page.</p>;
    }

    return (
        <div className="col-md-12">
            <h2>Patient Dashboard</h2>
            <p><h3>Welcome {currentUser.name}! Here, you can view your medical records, and communicate with your doctor.</h3></p>
            {/* Add your patient-specific dashboard content and functionality */}
        </div>
    );
};

export default PatientDashboard;
