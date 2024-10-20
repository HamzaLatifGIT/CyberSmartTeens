import React, { useEffect, useState } from "react";

// ANT-D :
import { Table, Tag, Button, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { DeleteStudentAPI, GetAllStudentsAPI } from "../Api/auth";
import { CreateStudentAPI } from "../Api/auth";
import { toast } from "react-hot-toast"
const { Option } = Select;

// CSS :



const List = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);  // New state to track form view

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  // Function to handle deleting a user
  const handleDelete = async (key) => {
    let res = await DeleteStudentAPI(key)
    if (res.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res.data?.message)
      setRefresh(!refresh)
    }
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
  const handleFormSubmit = async (values) => {
    let res = await CreateStudentAPI(values)
    if (res.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res.data?.message)
      setIsAddingStudent(false);  // Go back to the list view after submitting
      setRefresh(!refresh)
    }
  };

  // Function to handle canceling form submission
  const handleCancelAddStudent = () => {
    setIsAddingStudent(false);  // Go back to the list view
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => `${record?.firstName} ${record?.lastName}`
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
      dataIndex: 'Score',
      key: 'Score',
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
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const gettingStudentsData = async () => {
    setLoading(true);
    const result = await GetAllStudentsAPI();
    if (result.error != null) {
      toast.error(result.error);
    } else {
      let StudentData = []
      let processData = result?.data?.result?.map(async user => {
        let score = 0
        let process = user?.quizAttempts?.map(data => {
          score = score + data?.correct
        })
        await Promise.all(process)
        StudentData.push({
          ...user,
          Score: score
        })
      })
      await Promise.all(processData)
      setStudents(StudentData);
    }
    setLoading(false);
  }
  useEffect(() => {
    gettingStudentsData()
  }, [refresh])
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
              <div className="flex" style={{ gap: "1.5rem" }}>
                <Form.Item
                  style={{ width: "100%" }}
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter the first name!' }]}
                >
                  <Input placeholder="Enter First Name" className='custom-input' />
                </Form.Item>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter the last name!' }]}
                >
                  <Input placeholder="Enter last name" className='custom-input' />
                </Form.Item>
              </div>
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
            <Table columns={columns} dataSource={students} pagination={false} loading={loading} />

            {/* Modal to show user details */}
            <Modal
              title="User Details"
              visible={isModalVisible}
              onCancel={handleCloseModal}
              footer={null}  // You can add buttons if needed
            >
              {selectedUser && (
                <div>
                  <p><strong>Username:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <p><strong>Score:</strong> {selectedUser.Score}</p>
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
