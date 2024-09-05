import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from 'react-router-dom';

// Components:
import Dashboard from './Dashboard';
import Settings from './Settings';
import Profile from './Profile';
import Courses from './Courses';
import Quiz from './Quiz';

// Assets | ICONS:
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/zeropark-logo-color-cm.svg";
import { RiProfileFill, RiDashboardFill } from "react-icons/ri";
import { MdLibraryBooks, MdQuiz, MdSettingsApplications  } from "react-icons/md";
import resposivelogo from '../assets/Untitled (4).svg'

// CSS:
import './style/MyAccount.scss';

const MyAccount = () => {
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
                <img src={logo} alt="" style={{ paddingLeft: '7px' }} className='web-logo' />
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
                            to="setting"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            <div className="flex"> <MdSettingsApplications size={20} /> <span> Settings</span></div>    <IoIosArrowForward />
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="content">
                <Routes>
                    <Route path="profile" element={<Profile />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="setting" element={<Settings />} />
                    <Route path="*" element={<Navigate to="profile" />} />
                </Routes>
            </div>
        </div>
    );
};

export default MyAccount;
