import React from 'react';
import { useNavigate } from "react-router-dom"

// Assets | Icons | Logo :
import logo from "../assets/zeropark-logo-color-cm.svg";
import linkedin from '../assets/Social-logo/linkedin-white.svg'
import facebook from '../assets/Social-logo/facebook-white.svg'
import instagram from '../assets/Social-logo/instagram-white.svg'

// css :
import './style/Footer.scss';

const Footer = () => {

    let Navigate = useNavigate();
    const token = localStorage.getItem("CyberTeensToken");


    const GoToElement = (section) => {
        Navigate("/")
        setTimeout(() => {
            const element = document.getElementById(section);
            element?.scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    }

    return (
        <footer className="footer">
            <div className="footer__container max-width">
                <div className="footer__flex">
                    <div className="footer__logo">
                        <div> <img src={logo} alt="Zeropark Logo" /></div>


                    </div>
                    <div className="footer__columns">
                        <div className="footer__column">
                            <p>Pages</p>
                            <ul>
                                <li><div onClick={() => Navigate("/")}>Home</div></li>
                                <li><div href="" onClick={() => GoToElement("about")}>About</div></li>
                                {/* <li><p href="#">Contact us</p></li> */}
                            </ul>
                        </div>
                        <div className="footer__column">
                            <p>Resources</p>
                            <ul>
                                <li><div onClick={() => Navigate("/quizzes")} >Quiz</div></li>
                                <li><div onClick={() => Navigate("/courses")} >Courses</div></li>
                            </ul>
                        </div>
                        {
                            !token &&
                            <div className="footer__column">
                                <p>Get Full Acess</p>
                                <ul>
                                    <li><a href="/login">Login</a></li>
                                    <li><a href="/signup">Signup</a></li>
                                </ul>
                            </div>
                        }

                    </div>
                </div>
                <div className="footer__social">
                    <div className='footer__social__icons'> <a href="#"><img src={linkedin} alt="LinkedIn" /></a>
                        <a href="#"><img src={facebook} alt="Facebook" /></a>
                        <a href="#"><img src={instagram} alt="Instagram" /></a>
                    </div>
                    <div><p>© 2024 Cyber Smart Teens</p></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
