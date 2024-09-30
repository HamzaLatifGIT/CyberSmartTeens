import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ANT-D :
import { Dropdown } from "antd";

// Assets | ICONS :
import { IoMdPerson } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMenu, IoIosClose, IoIosArrowDown } from "react-icons/io";
import logo from "../assets/zeropark-logo-color-cm.svg";

// CSS :
import "./style/Navbar.scss";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const userData = localStorage.getItem("CyberTeensUserData");
  const user = JSON.parse(userData);
  const token = localStorage.getItem("CyberTeensToken");

  const GoToElement = (section) => {
    navigate("/")
    setTimeout(() => {
      const element = document.getElementById(section);
      element?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 1000);
  }

  const handleGoToLogout = () => {
    console.log("Logout button clicked", localStorage.getItem("CyberTeensToken"));
    localStorage.clear(); // Clear local storage only once
    toast.error("Logout Successful");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
    return true;
  };

  const itemsProfile = [
    {
      key: "1",
      label: <Link to={"/dashboard"}>My Account</Link>,
    },
    {
      key: "2",
      label: <div onClick={handleGoToLogout}>Logout</div>,
    },
  ];

  return (
    <>
      <header
        className="navbar"
        data-aos="slide-down"
        data-aos-duration="6000"
      >
        <div className="navbar__container max-width">
          <div onClick={() => navigate("/")} className="navbar__logo">
            <img src={logo} alt="Zeropark Logo" />
          </div>

          <button
            className="navbar__hamburger"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen ? "true" : "false"}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <IoIosClose size={30} color="black" />
            ) : (
              <IoIosMenu color="black" style={{ color: "black" }} size={30} />
            )}
          </button>

          <div
            className={`navbar__links ${isMenuOpen ? "navbar__links--open" : ""
              }`}
          >
            <ul>
              {/* <li>
                <Link to="/">
                  <span>
                    Home
                  </span>
                </Link>
              </li> */}
              <li>
                <div to="#about" onClick={() => GoToElement("about")}>
                  <span>
                    About
                  </span>
                </div>
              </li>
              <li>
                <Link to="/courses">Courses</Link>
                {/* <div to="#courses" onClick={() => GoToElement("courses")}>Courses</div> */}
              </li>
              <li>
                <Link to="/quizzes">Quizzes</Link>
                {/* <div to="#quizzes" onClick={() => GoToElement("quizzes")}>Quizzes</div> */}
              </li>
            </ul>

            {!token ? (
              <div className="navbar__auth">
                <div>
                  <button
                    className="signup-btn"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Sign up
                  </button>
                </div>
                <div>
                  <button
                    className="login-btn"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    <span className="icon">
                      <IoMdPerson size={20} /> Login
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile">
                <Dropdown menu={{ items: itemsProfile }} arrow>
                  <FaUserCircle size={33} />
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
