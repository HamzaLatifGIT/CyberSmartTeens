import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import UserActivityLineChart from './chart';
import { Pie } from 'react-chartjs-2';
import MyTable from './Table';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

// CSS :
import './style/dashboard.scss';

function Dashboard() {
  const [role, setRole] = useState(null);
  console.log(role)

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('CyberTeensUserData'));
    if (userData && userData.role) {
      setRole(userData.role);
      console.log(userData)
    }
  }, []);

  // Example data for charts and other components
  const chartData = {
    labels: ["Teachers", "Students"],
    datasets: [
      {
        data: [12, 29],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderWidth: 1,
      },
    ],
  };

  const studentsData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Emma Williams', email: 'emma@example.com' },
    { id: 5, name: 'Chris Evans', email: 'chris@example.com' }
  ];

  const teachersData = [
    { id: 1, name: 'David Clark', email: 'david@example.com' },
    { id: 2, name: 'Sophia Turner', email: 'sophia@example.com' },
  ];

  // Separate user item component
  const UserItem = ({ user }) => (
    <li className="user-item" key={user.id}>
      <div className="user-info">
        <div className="user-avatar">
          <UserOutlined style={{ fontSize: '40px', color: '#888' }} />
        </div>
        <div className="user-details">
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      </div>
      <span className="arrow-icon">›</span>
    </li>
  );

  return (
    <div className='dashboard-container'>
      <div className="heading"><h1>{role === 'Teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}</h1></div>
      <div className="dashboard-content">
        <div className="left-side">
          <div className="boxs">
            <div className="box">
              <h3>{role === 'Teacher' ? 'Total Student' : 'Total Teachers'}</h3> 
              <span>{role === 'teacher' ? 12 : 33}</span>
            </div>
            <div className="box">
              <h3>{role === 'Student' ? 'Active Teachers' : 'Active Students'}</h3>
              <span>{role === 'teacher' ? 4 : 5}</span>
            </div>
            <div className="box">
              <h3>{role === 'Student' ? 'Total Score' : 'Total Lessons/Quizzes'}</h3>
              <span>{role === 'teacher' ? 15 : 10}</span>
            </div>
          </div>

          <div className="charts">
            <UserActivityLineChart />
          </div>

          <div className="Table">
            <MyTable />
          </div>
        </div>

        <div className="user-list">
          <div className="user-table-container">
            <div className="user-table-header">
              <span className="user-table-title">
                {role === 'Student' ? 'Recent Join Teachers' : 'Recent Join Students'}
              </span>
            </div>
            <ul className="user-list">
              {(role === 'Student' ? teachersData : studentsData).map(user => (
                <UserItem user={user} key={user.id} />
              ))}
            </ul>
          </div>

          <div className="charts">
            <Pie data={chartData} height={300} width={400} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;