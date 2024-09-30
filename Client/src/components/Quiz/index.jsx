import React from "react";
// import Slider from "react-slick";

// Components :
// import Button from "../../Button";

// Assets | Icons | Logo :
// import card1Right from "../../../assets/card1Right.svg";

// css :
import "./About.scss";
import { Button } from "antd";
import Categories from "./Components/QuizzesList";




const About = () => {
 
  return (
    <div className="aboutContainer">
      <div className="aboutHero">
        <div className="quizheroHeading">
         Quiz
        </div>
        <div className="quizheroAbout">
        Accelerate your learning journey in cybersecurity with our interactive <strong>quizzes</strong>  and <strong>flashcards</strong>  designed to reinforce critical concepts and challenge your understanding. Whether you're preparing for certification exams or simply looking to enhance your expertise, our engaging quizzes help you assess your skills in real-time, while flashcards provide a quick and effective way to memorize key terms and principles. Dive into topics like network security, encryption, threat analysis, and more, and transform theory into practice. Stay ahead of the curve and master cybersecurity with fun, interactive learning tools!


        </div>
        <div className="quizheroButton">
          <Button>Try It</Button>
        </div>
      </div>

      <div className="content">
        <div className="flex">
          <Categories/>
        </div>
      </div>
 

     

     
    </div>
  );
};

export default About;
