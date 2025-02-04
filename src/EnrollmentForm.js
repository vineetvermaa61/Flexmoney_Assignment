import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const EnrollmentForm = () => {
  const [batch, setBatch] = useState("6-7AM");
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/enroll`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ batch })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Enrollment successful! Transaction ID: ${data.payment.transactionId}`);
        navigate('/', { replace: true });
      } else {
        setMessage(data.message || 'Enrollment failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Enroll in This Month's Yoga Class</h2>
      <p className="text-lg text-gray-700 text-center mb-4">Monthly Fee: INR 500</p>
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Select Batch:</label>
          <select 
            value={batch} 
            onChange={e => setBatch(e.target.value)} 
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="6-7AM">6-7AM</option>
            <option value="7-8AM">7-8AM</option>
            <option value="8-9AM">8-9AM</option>
            <option value="5-6PM">5-6PM</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Enroll
        </button>
      </form>
    </div>
  );
};

export default EnrollmentForm;
