import React from "react";
// import Slider from "react-slick";

// ANT-D :
// import { Button } from "antd";

// Components :
import Navbar from "../Navbar";
import Footer from "../Footer";
import CoursesList from "./Components/CoursesList";
// import Button from "../../Button";

// Assets | Icons | Logo :
// import card1Right from "../../../assets/card1Right.svg";

// CSS :
import "./index.scss";



const Courses = () => {

  return (
    <>
      <Navbar />
      <div className="courseContainer">
        <div className="aboutHero">
          <div className="backdrop" />
          <div className="heroHeading">
            Courses
          </div>
          <div className="heroAbout">
            Cybersecurity courses are designed to equip individuals with the knowledge and skills needed to protect systems, networks, and data from cyber threats. These courses cover a broad range of topics, including network security, ethical hacking, encryption, risk management, and vulnerability assessment. Students learn how to identify potential security breaches, implement protective measures, and respond to incidents effectively. With the increasing number of cyberattacks and data breaches, cybersecurity has become a critical field in today’s digital world, making these courses highly valuable for anyone interested in a career in IT security or looking to strengthen their organization's defenses.
          </div>
        </div>
        <CoursesList />
      </div>
      <Footer />
    </>
  );
};

export default Courses;
