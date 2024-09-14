import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserActivityLineChart = () => {
  const [role, setRole] = useState(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('CyberTeensUserData'));
    if (userData && userData.role) {
      setRole(userData.role);
    }
  }, []);

  // Data for students (e.g., score progress)
  const studentData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Score Progress', // Label for students dataset
        data: [75, 80, 85, 90, 88, 92, 95, 93, 97, 96, 98, 100], // Example score data for students
        borderColor: 'rgba(54, 162, 235, 1)', // Line color
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Fill color below the line
        fill: true,
        tension: 0.4, // Curved line
        pointBackgroundColor: 'rgba(54, 162, 235, 1)', // Point color
        pointBorderColor: '#fff', // Border around points
        pointHoverBackgroundColor: '#fff', // Hover effect for points
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)' // Hover border color
      }
    ]
  };

  // Data for teachers (e.g., student activity over the year)
  const teacherData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Students Activity', // Label for teachers dataset
        data: [30, 45, 60, 80, 90, 100, 75, 65, 95, 70, 55, 85], // Example activity data for teachers
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color below the line
        fill: true,
        tension: 0.4, // Curved line
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
        pointBorderColor: '#fff', // Border around points
        pointHoverBackgroundColor: '#fff', // Hover effect for points
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)' // Hover border color
      }
    ]
  };

  // Chart options for responsiveness and aesthetics
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' // Position of the legend
      },
      title: {
        display: true,
        text: role === 'Student' ? 'Score Progress Over the Year' : 'Students Activity Over the Year' // Dynamically set the title
      }
    },
    scales: {
      y: {
        beginAtZero: true // Y-axis starts at zero
      }
    }
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      {/* Conditionally render data based on user role */}
      <Line data={role === 'Student' ? studentData : teacherData} options={options} />
    </div>
  );
};

export default UserActivityLineChart;
