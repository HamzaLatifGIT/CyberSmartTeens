import React from 'react';

// Assets : ICONS :
import { UserOutlined } from '@ant-design/icons';

// Helper :
import UserActivityLineChart from './chart';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import MyTable from './Table';

// CSS :
import './style/dashboard.scss';

function Dashboard() {

  const chartData = {
    labels: ["Teachers", "Students"],
    datasets: [
      {
        data: [12, 29],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const usersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Emma Williams', email: 'emma@example.com' },
    { id: 5, name: 'Chris Evans', email: 'chris@example.com' }
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
      <div className="heading"><h1>Dashboard</h1></div>
      <div className="dashboard-content">
        <div className="left-side">
          <div className="boxs">
            <div className="box"><h3>Total Students</h3> <span>33</span></div>
            <div className="box"><h3>Active Students</h3> <span>5</span></div>
            <div className="box"><h3>Total Lessons/Quizzes</h3> <span>10</span></div>
          </div>

          <div className="charts">
            <UserActivityLineChart />
          </div>

          <div className="Table ">
            <MyTable />
          </div>
        </div>

        <div className="user-list">
          <div className="user-table-container">
            <div className="user-table-header">
              <span className="user-table-title">Recent Join Students</span>
            </div>
            <ul className="user-list">
              {usersData.map(user => (
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
