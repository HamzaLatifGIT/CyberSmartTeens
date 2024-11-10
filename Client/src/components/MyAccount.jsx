import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate, Navigate } from 'react-router-dom';

// Components:
import Dashboard from './Dashboard';
import Settings from './Settings';
import Profile from './Profile';
import Courses from './Courses';
import Quiz from './Quiz';
import FlashCard from '../Pages/Dashboard/FlashCards/index';
import Subjectives from './Subjectives';

// Assets | ICONS:
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/zeropark-logo-color-cm.svg";
import { RiProfileFill, RiDashboardFill } from "react-icons/ri";
import { MdLibraryBooks, MdQuiz, MdSettingsApplications, MdSubject } from "react-icons/md";
import { FaListAlt } from "react-icons/fa";
import resposivelogo from '../assets/Untitled (4).svg'
import { IoFlash } from "react-icons/io5";

// Redux :
import { useSelector } from 'react-redux';

// CSS:
import './style/MyAccount.scss';
import List from './List';
import AddCourse from './AddCourse';
import Result from './Result';





const MyAccount = () => {
    const navigate = useNavigate();

    let UserData = useSelector(state => state?.userData)

    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    const onChangee = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setPreviewImage(reader.result);
        } else {
            setPreviewImage(null);
        }
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const imgWindow = window.open(src);
        imgWindow?.document.write(`<img src="${src}" alt="preview" />`);
    };

    return (
        <div className="myaccount-container">
            <div className="sidebar">
                <img src={resposivelogo} className='mobile-logo' alt="" style={{ paddingLeft: '7px' }} />
                <img src={logo} alt="" style={{ paddingLeft: '7px' }} className='web-logo' onClick={() => navigate('/')} />
                <ul>
                    <li>
                        <NavLink
                            to="profile"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            <div className='flex'> <RiProfileFill size={20} /> <span>My Profile</span> </div>   <IoIosArrowForward />
                        </NavLink>
                    </li>
                </ul>
                <ul>
                    <li>
                        <NavLink
                            to="dashboard"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            <div className="flex"><RiDashboardFill size={20} /><span>  Dashboard </span></div> <IoIosArrowForward />
                        </NavLink>
                    </li>
                </ul>
                <ul>
                    <li>
                        <NavLink
                            to="scores"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            <div className="flex"> <MdSubject size={20} /> <span> Quizzes Score</span></div> <IoIosArrowForward />
                        </NavLink>
                    </li>
                </ul>
                {
                    UserData?.role == "Teacher" &&
                    <>
                        <ul>
                            <li>
                                <NavLink
                                    to="list"
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                >
                                    <div className="flex"> <FaListAlt size={19} /> <span> Students List</span></div>    <IoIosArrowForward />
                                </NavLink>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <NavLink
                                    to="courses"
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                >
                                    <div className="flex"><MdLibraryBooks size={20} /><span>Courses</span></div>   <IoIosArrowForward />
                                </NavLink>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <NavLink
                                    to="quiz"
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                >
                                    <div className="flex"> <MdQuiz size={20} /> <span> Quizes</span></div>    <IoIosArrowForward />
                                </NavLink>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <NavLink
                                    to="flash"
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                >
                                    <div className="flex"> <IoFlash size={20} /> <span> FlashCards</span></div>    <IoIosArrowForward />
                                </NavLink>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <NavLink
                                    to="subjective"
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                >
                                    <div className="flex"> <MdSubject size={20} /> <span> Subjectives</span></div> <IoIosArrowForward />
                                </NavLink>
                            </li>
                        </ul>
                    </>
                }

            </div>
            <div className="content">
                <Routes>
                    <Route path="profile" element={<Profile />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="list" element={<List />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="flash" element={<FlashCard />} />
                    <Route path="subjective" element={<Subjectives />} />
                    <Route path="scores" element={<Result />} />
                    <Route path="addCourse" element={<AddCourse />} />
                    <Route path="*" element={<Navigate to="profile" />} />
                </Routes>
            </div>
        </div>
    );
};

export default MyAccount;
