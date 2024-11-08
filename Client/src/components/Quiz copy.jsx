import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { DeleteOutlined, EditOutlined, EyeFilled } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';

// Components :
import AddQuiz from './AddQuiz';

// APIs :
import { DeleteQuizAPI, GetAllQuizesAPI } from '../Api/quiz';
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
    },
    {
      title: 'Quiz Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Subject',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories) =>
        categories && categories.length > 0
          ? categories.map((cat) => cat.name).join(', ') // Join category names with commas
          : 'Not Specified',
    },
    {
      title: 'Date Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(), // Formatting the date
    },
    {
      title: 'Types',
      dataIndex: 'types',
      key: 'types',
      render: (types) => types?.length >= 1 && types.join(" , "), // Formatting the date
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
            onClick={() => EditQuiz(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)} // Assuming record._id holds unique ID
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];


  // Fetch quizzes when component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const result = await GetAllQuizesAPI();
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
  const EditQuiz = (record) => {
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
        <AddQuiz selectedQuiz={selectedQuiz} closeSubPage={ClosePage} />
      ) : (
        <div>
          <div className="flex">
            <h2>Quizzes</h2>
            <div>
              <Button className="btn" onClick={handleAddQuizClick}>
                Add Quiz
              </Button>
            </div>
          </div>
          <Table loading={loading} dataSource={quizzes} columns={columns} rowKey="_id" />
        </div>
      )}
    </div>
  );
};

export default Quizes;
