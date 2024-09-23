import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Form, message, Upload, Spin, Modal } from 'antd';

// API :
import { GetAllCoursesAPI } from '../Api/course';

// CSS :
import './style/Quiz.scss';
import AddCourse from './AddCourse';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // Modal state for course details
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // To store the selected course details

  const columns = [
    {
      title: 'Course',
      dataIndex: 'title',
      key: 'title',
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
      title: 'Quote',
      dataIndex: 'quote',
      key: 'quote',
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
            icon={<EyeOutlined />}
            onClick={() => handleView(record)} // Show modal with course details
            style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
          >
            View
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

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      const result = await GetAllCoursesAPI();
      console.log(result); // Log the entire response for debugging
      if (result.error) {
        setError(result.error);
      } else {
        let coursedata = result.data.result;
        setCourses(coursedata || []); // Ensure we set an array even if result is null/undefined
        console.log(coursedata); // Log the fetched courses for debugging
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Handle form submission
  const onFinish = (values) => {
    const newCourse = {
      title: values.title,
      categories: values.categories || [], // Assuming categories is an array
      quote: values.quote || 'Not Specified',
      date: new Date().toLocaleDateString(),
    };
    setCourses([...courses, newCourse]);
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

  // Function to handle the "Add Course" button click
  const handleAddCourseClick = () => {
    setIsAddingCourse(true);
  };

  // Function to handle viewing course details (open modal)
  const handleView = (record) => {
    setSelectedCourse(record); // Set the selected course data
    setIsModalVisible(true); // Show the modal
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCourse(null); // Clear selected course data
  };

  // Function to handle deleting a course
  const handleDelete = (id) => {
    // Add logic to delete the course from the backend
    console.log('Deleting course with id:', id);
    setCourses(courses.filter((course) => course._id !== id)); // Remove course from the list
  };

  return (
    <div>
      {isAddingCourse ? (
        <AddCourse />
      ) : (
        <div>
          <div className="flex">
            <h2>Courses</h2>
            <div>
              <Button className="btn" onClick={handleAddCourseClick}>
                Add Course
              </Button>
            </div>
          </div>

          {loading ? (
            <Spin tip="Loading..." />
          ) : error ? (
            <div>{error}</div>
          ) : (
            <Table dataSource={courses || []} columns={columns} rowKey="_id" /> // Ensure `rowKey` is a unique key like `_id`
          )}

          {/* Modal for showing course details */}
          <Modal
            title="Course Details"
            visible={isModalVisible}
            onCancel={handleCloseModal}
            footer={null}  // You can add buttons if needed
          >
            {selectedCourse && (
              <div>
                <p><strong>Title:</strong> {selectedCourse.title}</p>
                <p><strong>Categories:</strong> {selectedCourse.categories && selectedCourse.categories.length > 0
                  ? selectedCourse.categories.map(cat => cat.name).join(', ')
                  : 'Not Specified'}</p>
                <p><strong>Quote:</strong> {selectedCourse.quote || 'Not Specified'}</p>
                <p><strong>Date Uploaded:</strong> {new Date(selectedCourse.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedCourse.status || 'Pending'}</p>
              </div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Courses;
