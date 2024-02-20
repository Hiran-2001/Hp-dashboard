import React, { useEffect, useState } from 'react';
import "../App.css"
const Users = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("rest/fetch-users");
      const data = await response.json();
      setUserList(data.results);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  return (
    <section className="middle-sections" id="users">
      <h3 className="dash-head">Visitors</h3>
      <div id="userList">
        <table id="visiters" className="display" style={{ width: '100%' }}>
          {/* Render table headers here */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Product Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id}>
                {/* Render user data here */}
                <td>{user.name.length > 20 ? `${user.name.substr(0, 20)}..` : user.name}</td>
                <td>{user.email.length > 20 ? `${user.email.substr(0, 20)}..` : user.email}</td>
                <td>{user.productName.length > 20 ? `${user.productName.substr(0, 20)}..` : user.productName}</td>
                <td>{new Date(user.date).toLocaleString()}</td>
                <td>
                  <a href={`?id=${user._id}`} target="_blank">
                    <button className="dt-button buttons-copy buttons-html5">View Transcript</button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Users;
