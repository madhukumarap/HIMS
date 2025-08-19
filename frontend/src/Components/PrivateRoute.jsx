import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const currentUser = AuthService.getCurrentUser();
    const navigate = useNavigate();

    if (!currentUser) {
        // User is not logged in, navigate to login page
        navigate('/login');
        return null;
    }

    // Check if user has required role
    if (roles && roles.indexOf(currentUser.roles[0]) === -1) {
        // User does not have required role, navigate to unauthorized page
        navigate('/unauthorized');
        return null;
    }

    // User is logged in and has required role, render the component
    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateRoute;
