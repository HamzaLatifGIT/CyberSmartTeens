import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { DeleteOutlined, EditOutlined, EyeFilled } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';

import toast from 'react-hot-toast';

// CSS :
import './style/Quiz.scss';
import AddQuiz from './AddQuiz';
import { GetAllQuizesAPI } from '../Api/quiz';

const Quizes = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store selected quiz details

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
      title: 'No of Questions',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => questions.length, // Formatting the date
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<EyeFilled />}
            onClick={() => handleView(record)} // Function to open modal
            style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
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

  // Function to handle the "Add Quiz" button click
  const handleAddStudentClick = () => {
    setIsAddingStudent(true);
  };

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
  }, []);

  // Function to handle viewing quiz details
  const handleView = (record) => {
    setSelectedQuiz(record); // Set the selected quiz details
    setIsModalVisible(true); // Show the modal
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedQuiz(null); // Clear selected quiz data
  };

  return (
    <div>
      {isAddingStudent ? (
        <AddQuiz />
      ) : (
        <div>
          <div className="flex">
            <h2>Quizzes</h2>
            <div>
              <Button className="btn" onClick={handleAddStudentClick}>
                Add Quiz
              </Button>
            </div>
          </div>

          <Table dataSource={quizzes} columns={columns} rowKey="_id" />

          {/* Modal for showing quiz details */}
          <Modal
            title="Quiz Details"
            visible={isModalVisible}
            onCancel={handleCloseModal}
            footer={null} // No footer buttons for now
          >
            {selectedQuiz && (
              <div>
                <p><strong>Title:</strong> {selectedQuiz.title}</p>
                <p><strong>Slug:</strong> {selectedQuiz.slug}</p>
                <p><strong>Categories:</strong> {selectedQuiz.categories && selectedQuiz.categories.length > 0
                  ? selectedQuiz.categories.map(cat => cat.name).join(', ')
                  : 'Not Specified'}</p>
                <p><strong>Date Uploaded:</strong> {new Date(selectedQuiz.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedQuiz.status || 'Pending'}</p>

                {/* Show the list of questions */}
                <h4>Questions:</h4>
                <ul>
                  {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                    selectedQuiz.questions.map((question, index) => (
                      <li key={index}>
                        <strong>Q{index + 1}: </strong>{question.question} <br/><strong> Ans:</strong>{question.answer}
                      </li>
                    ))
                  ) : (
                    <p>No questions added yet.</p>
                  )}
                </ul>
              </div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Quizes;
