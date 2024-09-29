import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Components :
import Navbar from '../Navbar';
import Footer from '../Footer';

import ImgURLGen from "../../Utils/ImgUrlGen"

// CSS :
import './CourseDetail.scss';





const CourseDetail = () => {
  let Navigate = useNavigate();
  const Location = useLocation();

  let Data = Location.state?.data
  let AllCourses = Location.state?.allCourses


  const ViewDetails = (course) => {
    Navigate("/course", { state: { data: course, allCourses: AllCourses } })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
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
            {/* <p>
              Quran is the holy book of Islam. It is written in Arabic and is the revealed word of Allah (God) to the
              prophet Muhammad. Quran consists of 114 chapters that are each subdivided into verses...
            </p>

            <h2>The Benefits Of Learning Quran Online</h2>

            <p>
              One of the benefits of learning the Quran online is that you will learn at your own pace...
            </p> */}
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
            <div className="tags">Recent Added Courses</div>
            {
              AllCourses?.map((data, index) => {
                return (
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
