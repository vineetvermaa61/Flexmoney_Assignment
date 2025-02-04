import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import EnrollmentForm from './EnrollmentForm';
import Profile from './Profile';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') ? true : false;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header with Flexmoney branding */}
        <header className="flex items-center justify-center p-4 bg-white shadow-md mb-6">
          <img src="/flexmoney_logo.png" alt="Flexmoney Logo" className="h-10 mr-4" />
          <h1 className="text-3xl font-bold text-blue-500">Flexmoney Internship Assignment</h1>
        </header>
        
        <div className="flex items-center justify-center">
          <div className="container mx-auto p-4 my-6">
            <Routes>
              <Route 
                path="/" 
                element={ isAuthenticated() ? <Profile /> : <Navigate to="/login" replace /> } 
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/enroll" 
                element={ isAuthenticated() ? <EnrollmentForm /> : <Navigate to="/login" replace /> } 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
