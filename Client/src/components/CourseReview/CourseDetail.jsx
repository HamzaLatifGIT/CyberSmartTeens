import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Components :
import Navbar from '../Navbar';
import Footer from '../Footer';

// APIs :
import { GetAllPublicCoursesAPI } from '../../Api/course';
// Helpers:
import ImgURLGen from "../../Utils/ImgUrlGen"

// CSS :
import './CourseDetail.scss';





const CourseDetail = () => {
  let Navigate = useNavigate();
  const Location = useLocation();

  let Data = Location.state?.data
  // let AllCourses = Location.state?.allCourses

  const [selectedLesson, setSelectedLesson] = useState(0)
  const [AllCourses, setAllCourses] = useState([])

  const ViewDetails = (course) => {
    Navigate("/course", { state: { data: course } })
  }
  const ViewQuiz = (quiz) => {
    // if (quiz?.type == "flash" || quiz?.type == "puzzle") {
    //   Navigate("/card", { state: { data: quiz, AllQuizzes: AllQuizzes } })
    // } else if (quiz?.type == "mcq" || quiz?.type == "open" || quiz?.type == "true") {
    //   Navigate("/mcqs", { state: quiz })
    // }
    Navigate("/card", { state: { data: quiz } })
  }


  const fetchCourses = async () => {
    try {
      const response = await GetAllPublicCoursesAPI();
      setAllCourses(response.data?.result || [])
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchCourses()
  }, [])

  return (
    <>
      <Navbar />
      <div className="blog-post-container">
        <div className="blog-post">
          <div className="post-header">
            <div className="date">PUBLISHED ON: Sep 27, 2024</div>
          </div>

          <div className="post-image">
            <img src={Data?.image && ImgURLGen(Data?.image)} alt="Quran" />
          </div>

          <h1 className="post-title">{Data?.title}</h1>

          <div className="post-content">
            <blockquote className="quote">
              <span>“</span> {Data?.quote} <span>”</span>
            </blockquote>
            <div className="courseContent" dangerouslySetInnerHTML={{ __html: Data?.detail }} />
            {
              Data?.lessons && Data?.lessons?.length >= 1 &&
              <>
                <div className="lessonList">
                  {
                    Data?.lessons?.map((data, index) => <> <div key={index} onClick={() => setSelectedLesson(index)} style={selectedLesson == index ? { backgroundColor: "rgb(71, 250, 198)" } : {}} className="lessonNumber"> Lesson {index + 1} </div> </>)
                  }
                </div>
                <div className="courseContent" dangerouslySetInnerHTML={{ __html: Data?.lessons[selectedLesson] }} />

              </>
            }
          </div>
        </div>

        <div className="sidebar">
          <div className="tags">
            Categories
          </div>
          <div className="tagsList">
            {
              Data?.categories?.map((cat, index) => <div key={index} className="tag">{cat?.name}</div>)
            }
          </div>
          <div className="popular-posts">
            <div className="tags">Related FlashCards</div>
            <div className="popular-post" onClick={() => ViewQuiz(Data?.flashCard)}>
              <img src={Data?.quiz?.image && ImgURLGen(Data?.flashCard?.image)} alt="Popular post" />
              <div className="popular-post-content">
                <h4>{Data?.flashCard?.title}</h4>
                <p>{Data?.flashCard?.quote?.length >= 49 ? `${Data?.flashCard?.quote?.slice(0, 49)} ...` : Data?.flashCard?.quote}</p>
                <span>Sep 27, 2024</span>
              </div>
            </div>
          </div>
          <div className="popular-posts">
            <div className="tags">Related Quiz</div>
            <div className="popular-post" onClick={() => ViewQuiz(Data?.quiz)}>
              <img src={Data?.quiz?.image && ImgURLGen(Data?.quiz?.image)} alt="Popular post" />
              <div className="popular-post-content">
                <h4>{Data?.quiz?.title}</h4>
                <p>{Data?.quiz?.quote?.length >= 49 ? `${Data?.quiz?.quote?.slice(0, 49)} ...` : Data?.quiz?.quote}</p>
                <span>Sep 27, 2024</span>
              </div>
            </div>
          </div>
          <div className="popular-posts">
            <div className="tags">Recent Added Courses</div>
            {
              AllCourses?.map((data, index) => {
                return (
                  data?._id != Data?._id &&
                  <div className="popular-post" key={index} onClick={() => ViewDetails(data)}>
                    <img src={data?.image && ImgURLGen(data?.image)} alt="Popular post" />
                    <div className="popular-post-content">
                      <h4>{data?.title}</h4>
                      <p>{data?.quote?.length >= 49 ? `${data?.quote?.slice(0, 49)} ...` : data?.quote}</p>
                      <span>Sep 27, 2024</span>
                    </div>
                  </div>
                )
              })
            }

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetail;
