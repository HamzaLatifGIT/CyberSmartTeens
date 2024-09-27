import React from 'react';
import './CourseDetail.scss';

const CourseDetail= () => {
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <div className="post-header">
          <div className="date">PUBLISHED ON: Sep 27, 2024</div>
        </div>

        <div className="post-image">
          <img src="https://via.placeholder.com/600x400" alt="Quran" />
        </div>

        <h1 className="post-title">Learn Quran academy - A modern way to Learn Quran</h1>

        <div className="post-content">
          <blockquote className="quote">
            <span>“</span> The Benefits Of Learning Quran Online <span>”</span>
          </blockquote>

          <p>
            Quran is the holy book of Islam. It is written in Arabic and is the revealed word of Allah (God) to the 
            prophet Muhammad. Quran consists of 114 chapters that are each subdivided into verses...
          </p>

          <h2>The Benefits Of Learning Quran Online</h2>

          <p>
            One of the benefits of learning the Quran online is that you will learn at your own pace...
          </p>
        </div>
      </div>

      <div className="sidebar">
        <div className="tags">
            Categories
        </div>
          <div className="tag">Cyber Security</div>

        <div className="popular-posts">
          <div className="tags">Recent Added Courses</div>
          <div className="popular-post">
            <img src="https://via.placeholder.com/100x100" alt="Popular post" />
            <div className="popular-post-content">
              <h4>Learn Quran academy - A modern way to Learn Quran</h4>
              <p>Learn dolor sit amet, consectetur adipiscing elit...</p>
              <span>Sep 27, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
