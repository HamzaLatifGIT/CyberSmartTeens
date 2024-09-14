import React, { useState, useEffect } from "react";

// ANT-D :
import { Table, Tag, Button, Modal } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

// Sample Data for Students
const studentData = [
  {
    key: '1',
    teacher: 'John Doe',
    subject: 'Cybersecurity',
    score: 75,
  },
  {
    key: '2',
    teacher: 'Jane Smith',
    subject: 'Ethical Hacking',
    score: 85,
  },
];

// Sample Data for Teachers
const teacherData = [
  {
    key: '1',
    username: 'Ada Evans',
    email: 'student1@gmail.com',
    score: 75,
    status: 'Verified',
  },
  {
    key: '2',
    username: 'Adele Mills',
    email: 'student2@gmail.com',
    score: 85,
    status: 'Pending',
  },
];

const MyTable = () => {
  const [role, setRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch user data from localStorage and get role
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('CyberTeensUserData'));
    if (userData && userData.role) {
      setRole(userData.role);
    }
  }, []);

  // Function to handle deleting a user
  const handleDelete = (key) => {
    console.log("Deleted user with key:", key);
  };

  // Function to show modal with user details
  const handleView = (record) => {
    setSelectedUser(record);  // Set the selected user
    setIsModalVisible(true);  // Show modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Columns for Students
  const studentColumns = [
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          View
        </Button>
      ),
    },
  ];

  // Columns for Teachers
  const teacherColumns = [
    {
      title: 'Student Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Verified' ? 'green' : 'volcano';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Render Table based on Role */}
      {role === 'Student' ? (
        <Table columns={studentColumns} dataSource={studentData} pagination={false} />
      ) : role === 'Teacher' ? (
        <Table columns={teacherColumns} dataSource={teacherData} pagination={false} />
      ) : (
        <p>Loading...</p>
      )}

      {/* Modal to show user details */}
      <Modal
        title="Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}  // You can add buttons if needed
      >
        {selectedUser && (
          <div>
            {role === 'Student' ? (
              <>
                <p><strong>Teacher:</strong> {selectedUser.teacher}</p>
                <p><strong>Subject:</strong> {selectedUser.subject}</p>
                <p><strong>Score:</strong> {selectedUser.score}</p>
              </>
            ) : (
              <>
                <p><strong>Student Name:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Score:</strong> {selectedUser.score}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default MyTable;
