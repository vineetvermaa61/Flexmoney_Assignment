import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Helper function to compute the last day of the current month
function getPlanExpiryDate() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toLocaleDateString();
}

const Profile = () => {
  const [profile, setProfile] = useState({ user: null, enrollment: null, payment: null });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          setMessage(data.message || 'Failed to load profile.');
        }
      } catch (error) {
        console.error(error);
        setMessage('Server error.');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const planExpiryDate = getPlanExpiryDate();

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Personalized header for Flexmoney on the admission page */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold text-green-600">Flexmoney Yoga Admission</h2>
        <p className="text-sm italic text-gray-600">Leading the BUY NOW, PAY LATER Revolution</p>
      </div>
      
      {profile.user ? (
        <div className="mb-6">
          <p className="text-lg"><strong>Name:</strong> {profile.user.name}</p>
          <p className="text-lg"><strong>Email:</strong> {profile.user.email}</p>
          <p className="text-lg"><strong>Phone:</strong> {profile.user.phone}</p>
          <p className="text-lg"><strong>Age:</strong> {profile.user.age}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading user details...</p>
      )}
      
      {profile.enrollment ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Enrollment Details (Current Month)</h3>
          <p className="text-lg"><strong>Batch:</strong> {profile.enrollment.batch}</p>
          <p className="text-lg"><strong>Monthly Fee:</strong> INR 500</p>
          <p className="text-lg"><strong>Plan Valid Till:</strong> {planExpiryDate}</p>
          {profile.payment && profile.payment.status === 'success' ? (
            <p className="text-lg text-green-600 font-semibold">
              Payment Status: {profile.payment.status} ✔️
            </p>
          ) : profile.payment ? (
            <p className="text-lg text-red-600 font-semibold">
              Payment Status: {profile.payment.status}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mb-6 text-center">
          <p className="text-gray-500">You are not enrolled for this month yet.</p>
          <Link to="/enroll" className="text-blue-500 hover:underline">Enroll Now</Link>
        </div>
      )}
      
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <button 
        onClick={handleLogout} 
        className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
