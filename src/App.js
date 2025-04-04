// import logo from './logo.svg';
// import React from 'react';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <TestUserList />
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Updated for React Router v6
import MealPlanStepper from './MealStepper'; // Your existing Meal Plan Stepper component
import Home from './components/temp';
import StepperForm from './StepperForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './components/AdminPanel';
import AnotherPage from './test';
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
                    <ProtectedRoute requiredRole="user" formSubmittedRedirect="/test">
                        <StepperForm />
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<HomePage/>} />
                {/* Add the new route for /another-page */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <AnotherPage/>
                        </ProtectedRoute>
                    }
                />

        </Routes>
    </Router>
);



    // <Router>
    //   <div>


    //     <Routes>
    //       {/* Route for Home (MealPlanStepper) */}
    //       {/* <Route path="/home" element={<MealPlanStepper />} />
    //       <Route path="/" element={<Home />} /> */}

    //       {/* Route for Admin Login */}
    //       {/* <Route path="/admin-login" element={<AdminDashboard />} />
    //       <Route path="/admin-p" element={<AdminPanel />} /> */}
    //       <Route path="/" element={<StepperForm />} />
    //       <Route path="/l" element={<LoginForm />}

    //       />
    //     </Routes>
    //   </div>
    // </Router>
}

export default App;
