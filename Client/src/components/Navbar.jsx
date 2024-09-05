import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ANT-D :
import { Dropdown } from "antd";

// Assets | ICONS :
import { IoMdPerson } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/zeropark-logo-color-cm.svg";
import { IoIosMenu, IoIosClose } from "react-icons/io";

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

  const handleGoToLogout = () => {
    console.log("button is cliecked", localStorage.getItem("CyberTeensToken"));
    localStorage.clear();
    localStorage.clear();

    toast.error("Logout Successful")

    setTimeout(() => {
      window.location.href = "/"
    }, 1000);
    return true;
  };

  const itemsProfile = [
    {
      key: "3",
      label: <Link to={"/dashboard"}>My Account</Link>,
    },
    {
      key: "4",
      label: <div onClick={handleGoToLogout}>Logout</div>,
    },
  ];

  return (
    <>

      <header className="navbar"
        data-aos="slide-down"
        data-aos-duration='6000'>
        <div className="navbar__container max-width">
          <div onClick={() => navigate("/")} className="navbar__logo">
            <img src={logo} alt="Zeropark Logo" />
          </div>

          <button className="navbar__hamburger" onClick={toggleMenu}>
            {isMenuOpen ? (
              <IoIosClose size={30} color="black" />
            ) : (
              <IoIosMenu color="black" style={{ color: "black" }} size={30} />
            )}
          </button>

          <div
            className={`navbar__links ${isMenuOpen ? "navbar__links--open" : ""
              }`}>

            {!token ? <div className="navbar__auth">
              <div>
                <button className="signup-btn" onClick={() => { navigate('/signup') }}>Sign up</button>
              </div>
              <div>
                <button className="login-btn" onClick={() => { navigate('/login') }}>
                  {" "}
                  <span className="icon">
                    <IoMdPerson size={20} /> Login
                  </span>{" "}
                </button>
              </div>
            </div>
              :
              <div className="profile">
                <Dropdown menu={{ items: itemsProfile }} arrow>
                  <FaUserCircle size={33} />
                </Dropdown>
              </div>
            }
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
