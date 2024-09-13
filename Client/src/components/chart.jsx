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
  // Data for the chart
  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Students Activity', // Label for the dataset
        data: [30, 45, 60, 80, 90, 100, 75, 65, 95, 70, 55, 85], // Example user activity data
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
        text: 'Students Activity Over the Year' // Title of the chart
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
      <Line data={data} options={options} />
    </div>
  );
};

export default UserActivityLineChart;

