
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Updated for React Router v6
import StepperForm from './StepperForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
import AnotherPage from './components/UserModule';
import HomePage from './MealStepper';

function App() {


    return (
        <Router>
            <Routes>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user-form"
                    element={
                        <ProtectedRoute requiredRole="user" formSubmittedRedirect="/user">
                            <StepperForm />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<HomePage />} />
                {/* Add the new route for /another-page */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <AnotherPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </Router>
    );

}

export default App;
