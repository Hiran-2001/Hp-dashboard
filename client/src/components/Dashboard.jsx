import React, { useEffect, useState } from 'react';
import Users from './Users';
import Transcripts from './Transcripts';
import "../App.css"
const Dashboard = ({ isLoggedIn }) => {
  const [menu, setMenu] = useState('users');

  useEffect(() => {
    // Adjust this part based on your specific requirements
    // For example, you might want to load users by default
    if (isLoggedIn) {
      setMenu('users');
    } else {
      // Redirect to the login page if not authenticated
      window.location.href = '/login';
    }
  }, [isLoggedIn]);

  return (
    <div>

      <div className="content">
        {menu === 'users' && <Users />}
        {menu === 'transcripts' && <Transcripts  />}
      </div>
    </div>
  );
};

export default Dashboard;
