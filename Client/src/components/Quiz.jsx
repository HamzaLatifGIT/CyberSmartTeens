import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { UploadOutlined } from '@ant-design/icons';
import { Table, Input, Button, Form, message, Upload } from 'antd';

import toast from 'react-hot-toast';

// CSS :
import './style/Quiz.scss'
import AddQuiz from './AddQuiz';
import { GetAllQuizesAPI } from '../Api/quiz';

const Quizes = () => {
  const Navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false)
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


  // Function to handle the "Add Student" button click
  const handleAddStudentClick = () => {
    setIsAddingStudent(true);
  };


  // Fetch courses when component mounts
  useEffect(() => {
    const fetchQuizes = async () => {
      setLoading(true);
      const result = await GetAllQuizesAPI();
      if (result.error) {
        toast.error(result.error);
      } else {
        let quizes = result.data.result;
        setQuizzes(quizes || []); // Ensure we set an array even if result is null/undefined
      }
      setLoading(false);
    };
    fetchQuizes();
  }, []);


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
