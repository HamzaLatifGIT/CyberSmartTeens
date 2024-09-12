import React, { useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const data = [
  {
    key: '1',
    username: 'Ada Evans',
    email: 'jablawpuh@gmail.com',
    role: 'Student',
    score: 75,
    status: 'Rejected',
  },
  {
    key: '2',
    username: 'Adele McDaniel',
    email: 'li@gmail.com',
    role: 'Teacher',
    score: 90,
    status: 'Verified',
  },
  {
    key: '3',
    username: 'Adele Mills',
    email: 'hogmultep@gmail.com',
    role: 'Student',
    score: 85,
    status: 'Verified',
  },
  {
    key: '4',
    username: 'Aiden Fletcher',
    email: 'arhepo@gmail.com',
    role: 'Teacher',
    score: 60,
    status: 'Rejected',
  },
  // Add more data as needed
];

const MyTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
        let color = status === 'Verified' ? 'green' : status === 'Pending' ? 'blue' : 'volcano';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ marginRight: 8, backgroundColor:'rgb(71 250 198 / 26%)' }}
          >
            View
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} />

      {/* Modal to show user details */}
      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}  // You can add buttons if needed
      >
        {selectedUser && (
          <div>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Score:</strong> {selectedUser.score}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MyTable;
