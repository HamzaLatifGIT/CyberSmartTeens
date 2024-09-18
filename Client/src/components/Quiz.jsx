import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { UploadOutlined } from '@ant-design/icons';
import { Table, Input, Button, Form, message, Upload } from 'antd';

// CSS :
import './style/Quiz.scss'
import AddQuiz from './AddQuiz';

const Quizes = () => {
  const Navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [form] = Form.useForm();
  const [isAddingStudent, setIsAddingStudent] = useState(false);

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

    // Function to handle the "Add Student" button click
    const handleAddStudentClick = () => {
      setIsAddingStudent(true);
    };

  return (
    <div>

      {isAddingStudent ? (
        <AddQuiz />
      )
        :
        (
          <div>
            <div className='flex'><h2>Quizes</h2> <div><Button className="btn" onClick={handleAddStudentClick}>Add Quiz</Button></div></div>
            <Table dataSource={quizzes} columns={columns} rowKey="title" />
          </div>
        )
      }
    </div>
  );
};

export default Quizes;
