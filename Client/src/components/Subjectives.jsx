import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { DeleteOutlined, EditOutlined, EyeFilled } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';

// Components :
import SubjectiveDetaiils from './SubjectivesDetails';

// APIs :
import { DeleteQuizAPI, GetAllSubjectivesAPI } from '../Api/quiz';
// Helpers :
import toast from 'react-hot-toast';

// CSS :
import './style/Quiz.scss';





const Quizes = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store selected quiz details
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


  const columns = [
    {
      title: 'Quiz Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, data) => data?.quizData?.title
    },
    {
      title: 'Student Name',
      dataIndex: 'studentData',
      key: 'studentData',
      render: (_, data) => `${data?.studentData?.firstName} ${data?.studentData?.lastName}`
    },
    {
      title: 'No of Questions',
      dataIndex: 'questions',
      key: 'questions',
      render: (_, data) => data?.quizData?.quizzes?.find(quiz => quiz?._id == data?.quizId).questions.length, // Formatting the date
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status?.toUpperCase(), // Formatting the date
    },
    {
      title: 'Score',
      dataIndex: 'correct',
      key: 'correct',
      render: (correct) => correct, // Formatting the date
    },
    {
      title: 'Date Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(), // Formatting the date
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
            onClick={() => ViewQuiz(record)}
          >
            View
          </Button>
          {/* <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)} // Assuming record._id holds unique ID
          >
            Delete
          </Button> */}
        </span>
      ),
    },
  ];


  // Fetch quizzes when component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const result = await GetAllSubjectivesAPI();
      if (result.error) {
        toast.error(result.error);
      } else {
        let quizzes = result.data.result;
        setQuizzes(quizzes || []); // Ensure we set an array even if result is null/undefined
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, [refresh]);

  const handleAddQuizClick = () => {
    setIsAddingQuiz(true);
  };
  const ViewQuiz = (record) => {
    setSelectedQuiz(record);
    setIsAddingQuiz(true);
  };
  const ClosePage = () => {
    setIsAddingQuiz(false)
    setSelectedQuiz(null);
    setRefresh(!refresh)
  }


  // Function to handle deleting a course
  const handleDelete = async (id) => {
    setLoading(true);
    const result = await DeleteQuizAPI(id);
    if (result.error != null) {
      toast.error(result.error);
    } else {
      toast.success(result?.data?.message)
      setRefresh(!refresh)
    }
    setLoading(false);
  };


  return (
    <div>
      {isAddingQuiz ? (
        <SubjectiveDetaiils selectedQuiz={selectedQuiz} closeSubPage={ClosePage} />
      ) : (
        <div>
          <div className="flex">
            <h2>Open Questions</h2>
          </div>
          <Table loading={loading} dataSource={quizzes} columns={columns} rowKey="_id" />
        </div>
      )}
    </div>
  );
};

export default Quizes;
