import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { DeleteOutlined, EditOutlined, EyeFilled } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';

// Components :
import AddFlashCard from './components/AddEditFlashCard';

// APIs :
import { DeleteFlashCardsAPI, GetAllFlashCardsAPI } from '../../../Api/flashcard';
// Helpers :
import toast from 'react-hot-toast';

// CSS :
import './index.scss';





const FlashCards = () => {
  const navigate = useNavigate();

  const [flashCards, setFlashCard] = useState([]);
  const [selectedFlashCard, setSelectedFlashCard] = useState(null); // To store selected quiz details
  const [isAddingFlashCard, setIsAddingFlashCard] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


  const columns = [
    {
      title: 'FlashCard Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'FlashCard Slug',
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
      title: 'No. of Cards',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => questions?.length || 0, // Formatting the date
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
            onClick={() => EditFlashCard(record)}
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
    const fetchFlashCards = async () => {
      setLoading(true);
      const result = await GetAllFlashCardsAPI();
      if (result.error) {
        toast.error(result.error);
      } else {
        setFlashCard(result?.data?.result || []);
      }
      setLoading(false);
    };
    fetchFlashCards();
  }, [refresh]);

  const handleAddFlashCardClick = () => {
    setIsAddingFlashCard(true);
  };
  const EditFlashCard = (record) => {
    setSelectedFlashCard(record);
    setIsAddingFlashCard(true);
  };
  const ClosePage = () => {
    setIsAddingFlashCard(false)
    setSelectedFlashCard(null);
    setRefresh(!refresh)
  }


  // Function to handle deleting a course
  const handleDelete = async (id) => {
    setLoading(true);
    const result = await DeleteFlashCardsAPI(id);
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
      {isAddingFlashCard ? (
        <AddFlashCard selectedFlashCard={selectedFlashCard} closeSubPage={ClosePage} />
      ) : (
        <div>
          <div className="flex">
            <h2>Flash Cards</h2>
            <div>
              <Button className="btn" onClick={handleAddFlashCardClick}>
                Add Card
              </Button>
            </div>
          </div>
          <Table loading={loading} dataSource={flashCards} columns={columns} rowKey="_id" />
        </div>
      )}
    </div>
  );
};

export default FlashCards;
