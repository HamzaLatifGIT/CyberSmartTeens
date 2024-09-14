import React, { useState } from "react";

// ANT-D :
import { Table, Tag, Button, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
const { Option } = Select;

// CSS :



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

const List = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);  // New state to track form view

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

  // Function to handle the "Add Student" button click
  const handleAddStudentClick = () => {
    setIsAddingStudent(true);
  };

  // Function to handle form submission
  const handleFormSubmit = (values) => {
    console.log("Form values:", values);
    setIsAddingStudent(false);  // Go back to the list view after submitting
  };

  // Function to handle canceling form submission
  const handleCancelAddStudent = () => {
    setIsAddingStudent(false);  // Go back to the list view
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
            style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
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
      <div>
        {/* Conditionally render the table or the form */}
        {isAddingStudent ? (
          <div>
            <div className='flex'> <h2>Add New Student</h2></div>
            <Form
              layout="vertical"
              onFinish={handleFormSubmit}
              initialValues={{ role: "Student" }}  // Default role to 'Student'
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please enter the username!' }]}
              >
                <Input placeholder="Enter student name" className='custom-input' />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter the email!' }]}
              >
                <Input placeholder="Enter email" className='custom-input' />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Enter password' }]}
              >
                <Input type="password" placeholder="Enter password" className='custom-input' />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select the role!' }]}
              >
                <Select placeholder="Select role" className='custom-select ' >
                  <Option value="Student">Student</Option>
                  <Option value="Teacher">Teacher</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button className="btn" type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button className="btn" type="default" onClick={handleCancelAddStudent} style={{ marginLeft: 8 }}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div>
            <div className="flex" style={{ marginBottom: '15px' }}>
              <h2>List</h2>
              <Button className="btn" onClick={handleAddStudentClick}>
                Add Student
              </Button>
            </div>
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
          </div>
        )}
      </div>
    </>
  );
};

export default List;
