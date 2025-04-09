import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard page
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-gray-500">Redirecting to dashboard...</p>
    </div>
  );
};

export default Home;
