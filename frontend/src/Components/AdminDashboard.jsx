import React from 'react';
import AuthService from '../services/auth.service';

const AdminDashboard = () => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.roles.includes('ROLE_ADMIN')) {
        // If the user is not logged in or does not have the admin role,
        // you can show a message or redirect to another page.
        return <p>You are not authorized to access this page.</p>;
    }

    return (
        <div className="col-md-12">
            <h2>Admin Dashboard</h2>
            <p>Welcome to the admin dashboard! You have access to administrative features and controls here.</p>
            {/* Add your admin-specific dashboard content and functionality */}
        </div>
    );
};

export default AdminDashboard;
