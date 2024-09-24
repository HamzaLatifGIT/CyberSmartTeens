import React, { useEffect, useState, useRef } from 'react';
import './style/Topic.scss';
import topic from '../assets/037d20239665dd7593c167e528db8f33.webp';
import { GetAllCoursesAPI } from '../Api/course';
import { Skeleton, Button, Card } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

function Topics() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [inView, setInView] = useState(false);
  const topicRef = useRef(null);

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
          const response = await GetAllCoursesAPI();
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
    <div className='topic-container' ref={topicRef}>
      <h1>Topics</h1>

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
                  <img src={course?.image?.Location || topic} alt={course?.title || 'Course'} />
                  <h4>{course?.title || 'Course Title'}</h4>
                  <span>{course?.categories?.name || 'Category'}</span>
                  <p>{course?.quote || 'Course description goes here.'}</p>
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
