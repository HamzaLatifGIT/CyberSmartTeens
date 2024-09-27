import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { UploadOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Form, message, Upload, Spin, Modal } from 'antd';

// Components :
import AddCourse from './AddCourse';

// API :
import { GetAllCoursesAPI, DeleteCourseAPI } from '../Api/course';
// Helpers :
import toast from 'react-hot-toast';

// CSS :
import './style/Quiz.scss';





const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


  const columns = [
    {
      title: 'Course',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: 'Subject',
      dataIndex: 'categories',
      key: 'categories',
      width: 280,
      render: (categories) =>
        categories && categories.length > 0
          ? categories.map((cat) => cat.name).join(', ') // Join category names with commas
          : 'Not Specified',
    },
    {
      title: 'Quote',
      dataIndex: 'quote',
      key: 'quote',
      render: (_, data) => data?.quote?.length > 100 ? `${data?.quote?.slice(0, 100)} ...` : null
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
            onClick={() => EditCourse(record)}
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

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await GetAllCoursesAPI();
      if (result.error != null) {
        toast.error(result.error);
      } else {
        let coursedata = result.data.result;
        setCourses(coursedata || []); // Ensure we set an array even if result is null/undefined
      }
      setLoading(false);
    };
    fetchCourses();
  }, [refresh]);

  // Function to handle the "Add Course" button click
  const handleAddCourseClick = () => {
    setIsAddingCourse(true);
  };

  const EditCourse = (record) => {
    setSelectedCourse(record);
    setIsAddingCourse(true);
  };
  const ClosePage = () => {
    setIsAddingCourse(false)
    setSelectedCourse(null);
    setRefresh(!refresh)
  }

  // Function to handle deleting a course
  const handleDelete = async (id) => {
    setLoading(true);
    const result = await DeleteCourseAPI(id);
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
      {isAddingCourse ? (
        <AddCourse selectedCourse={selectedCourse} closeSubPage={ClosePage} />
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
          <Table loading={loading} dataSource={courses || []} columns={columns} rowKey="_id" />
        </div>
      )}
    </div>
  );
};

export default Courses;
