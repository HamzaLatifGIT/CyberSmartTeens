import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { Skeleton, Button, Card } from 'antd';

// ICONS :
import NoImg from "../assets/noImg.png"
import { CaretDownOutlined } from '@ant-design/icons';
import topic from '../assets/037d20239665dd7593c167e528db8f33.webp';

// APIs :
import { GetAllPublicCoursesAPI } from '../Api/course';
// Helpers :
import ImgURLGen from "../Utils/ImgUrlGen"

// CSS :
import './style/Topic.scss';





function Topics() {
  const Navigate = useNavigate()

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [inView, setInView] = useState(false);
  const topicRef = useRef(null);



  const ViewCourse = (course) => {
    Navigate("/course", { state: { data: course, allCourses: courses } })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (topicRef.current) {
      observer.observe(topicRef.current);
    }

    return () => {
      if (topicRef.current) {
        observer.unobserve(topicRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (inView) {
      const fetchCourses = async () => {
        try {
          setLoading(true);
          const response = await GetAllPublicCoursesAPI();
          console.log(response)
          setTimeout(() => {
            if (!response.error) {
              setCourses(response?.data?.result || []);
            }
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error('Error fetching courses:', error);
          setLoading(false);
        }
      };

      fetchCourses();
    }
  }, [inView]);

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <div id='courses' className='topic-container' ref={topicRef}>
      <h1>COURSES</h1>

      <div className="items">
        {loading ? (
          <div className='card'>
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="item" style={{ width: '350px', marginBottom: 16, padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Skeleton.Image active style={{ width: '300px', height: '200px', marginBottom: '1rem' }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className='card'>
              {courses.slice(0, showAll ? courses.length : 3).map((course, index) => (
                <div className="item" key={index}>
                  <img src={course?.image && ImgURLGen(course?.image) || topic} alt={course?.title || 'Course'} onError={(e) => { e.target.onerror = null; e.target.src = NoImg; }} />
                  <div className="content">
                    <div className="title">
                      <h4>Title:</h4> <p><i> {course?.title || 'Course Title'}  </i></p>
                    </div>
                    <div className="title">
                      <h4>Category:</h4> <p> {course?.categories?.map(cat => cat?.title).join(",") || 'Course Categories'} </p>
                    </div>
                    <div className="title">
                      <h4>Details:</h4> <p> {course?.quote.length > 78 ? `${course?.quote.slice(0, 78)} ...` : course?.quote || 'Course description goes here.'} </p>
                    </div>
                    <Button className="btn" onClick={() => ViewCourse(course)}>
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className='card'>
              {!showAll && courses.length > 3 && (
                <Button className="btn" onClick={handleShowAll}>
                  Show All <CaretDownOutlined />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Topics;
