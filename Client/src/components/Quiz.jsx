import React, { useState } from 'react';

// ANT-D :
import { UploadOutlined } from '@ant-design/icons';
import { Table, Input, Button, Form, message, Upload } from 'antd';

// CSS :
import './style/Quiz.scss'

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Quiz Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Teacher Name',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Date Uploaded',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Handle form submission
  const onFinish = (values) => {
    const newQuiz = {
      title: values.title,
      teacher: values.teacher || 'Unknown',
      subject: values.subject || 'Not Specified',
      date: new Date().toLocaleDateString(),
    };
    setQuizzes([...quizzes, newQuiz]);
    form.resetFields(); // Reset form after submission
  };

  const props = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div>
      <div className='flex'><h2>Quizes</h2></div>
      <div className="quiz-upload-header">
        <Form
          form={form}
          onFinish={onFinish}
          layout="inline"
          style={{ marginBottom: 20 }}
        >
          <Form.Item
            name="title"
            label="Title:"
            rules={[{ required: true, message: 'Please input quiz title!' }]}
          >
            <Input className="custome-input" placeholder="Enter quiz title" />
          </Form.Item>

          <Form.Item name="teacher" label="Teacher Name:">
            <Input className="custome-input" placeholder="Enter teacher name" />
          </Form.Item>

          <Form.Item name="subject" label="Subject:">
            <Input className="custome-input" placeholder="Enter subject" />
          </Form.Item>
          <Form.Item name="subject" label="Upload">
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button className='btn-2' type="primary" htmlType="submit">
              Upload Quiz
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Quiz List Table */}
      <Table dataSource={quizzes} columns={columns} rowKey="title" />
    </div>
  );
};

export default Quiz;
