import React from "react";

// ANT-D :
import { Button } from "antd";

// Components :
import Categories from "./Components/QuizzesList";
import Navbar from "../Navbar";
import Footer from "../Footer";

// CSS :
import "./index.scss";





const Quizzes = () => {

  return (
    <>
      <Navbar />
      <div className="quizzesContainer">
        <div className="aboutHero">
          <div className="backdrop" />
          <div className="heroHeading">
            Quiz
          </div>
          <div className="heroAbout">
            Accelerate your learning journey in cybersecurity with our interactive <strong>quizzes</strong>  and <strong>flashcards</strong>  designed to reinforce critical concepts and challenge your understanding. Whether you're preparing for certification exams or simply looking to enhance your expertise, our engaging quizzes help you assess your skills in real-time, while flashcards provide a quick and effective way to memorize key terms and principles. Dive into topics like network security, encryption, threat analysis, and more, and transform theory into practice. Stay ahead of the curve and master cybersecurity with fun, interactive learning tools!
          </div>
        </div>
        <Categories />
      </div>
      <Footer />
    </>
  );
};

export default Quizzes;
