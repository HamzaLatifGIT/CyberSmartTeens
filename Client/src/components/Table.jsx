import React from "react";
import { Table, Tag, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

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
    render: status => {
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
      <Button
        type="danger"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(record.key)}
      >
        Delete
      </Button>
    ),
  },
];

const handleDelete = (key) => {
  console.log("Deleted user with key:", key);
};

const MyTable = () => {
  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default MyTable;
