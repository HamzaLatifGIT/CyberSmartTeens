import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"

// ANT-D :
import { Skeleton, Button, Card } from 'antd';

// Assets | ICONS :
import NoImg from "../assets/noImg.png"
import { CaretDownOutlined } from '@ant-design/icons';
import topic from '../assets/037d20239665dd7593c167e528db8f33.webp';

// APIs :
import { GetAllPublicQuizesAPI } from '../Api/quiz';
// Helpers :
import ImgURLGen from "../Utils/ImgUrlGen"

// CSS :
import './style/Topic.scss';





function Topics() {
  let Navigate = useNavigate()

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [inView, setInView] = useState(false);
  const topicRef = useRef(null);


  const ShowDetails = (data) => {
    // if (data?.type == "flash" || data?.type == "puzzle") {
    //   Navigate("/card", { state: data })
    // } else if (data?.type == "mcq" || data?.type == "open" || data?.type == "true") {
    //   Navigate("/mcqs", { state: data })
    // }
    Navigate("/card", { state: { data , AllQuizzes: courses } })
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
          const response = await GetAllPublicQuizesAPI();
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
    <div id='quizzes' className='QuizListContainer' ref={topicRef}>
      <h1>QUIZZES</h1>

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
                <div className="item" key={index} style={{ height: "470px" }}>
                  <img src={course?.image && ImgURLGen(course?.image) || topic} alt={course?.title || 'Course'} onError={(e) => { e.target.onerror = null; e.target.src = NoImg; }} />
                  <div className="content">
                    <div className="title">
                      <h4>Title:</h4> <p><i> {course?.title || 'Course Title'}  </i></p>
                    </div>
                    <div className="title">
                      <h4>Category:</h4> <p> {course?.categories?.map(cat => cat?.name).join(" , ") || 'Course Categories'} </p>
                    </div>
                    <div className="title">
                      <h4>Types:</h4> <p> {course?.types?.join(" , ")?.toLocaleUpperCase() || 'Course Categories'} </p>
                    </div>
                    <div className="title">
                      <h4>Details:</h4> <p> {course?.quote.length > 78 ? `${course?.quote.slice(0, 78)} ...` : course?.quote || 'Course description goes here.'} </p>
                    </div>
                    <Button className="btn" onClick={() => ShowDetails(course)}>
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