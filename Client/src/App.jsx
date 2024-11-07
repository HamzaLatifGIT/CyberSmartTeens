import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Components
import Login from '../src/Auth/Login'
import Signup from '../src/Auth/Signup'
import Home from "./components/pages/Home";
import MyAccount from "./components/MyAccount";
import FlipcardComponent from "./components/FlipCard/Index"
import MCQQuestion from "./components/MCQs/MCQs";
import IndexMcqs from "./components/MCQs";
import CourseDetail from "./components/CourseReview/CourseDetail";
import Course from "./components/Course/index";
import Quiz from "./components/Quiz/index";
import About from "./components/About";

// APIs :
import { GetProfileAPI } from "./Api/auth";

// Redux :
import { useDispatch, useSelector } from 'react-redux';
import { userDataActions } from "./Redux/Slice/userData"

// Helpers :
import { Toaster } from 'react-hot-toast';






const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
const AuthRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {
  let Dispatch = useDispatch()

  let token = localStorage.getItem("CyberTeensToken")
  let AuthToken = token ?? null

  const gettingProfileData = async () => {
    let res = await GetProfileAPI()
    if (res.error != null) {

    } else {
      let userData = res.data?.data?.result;
      Dispatch(userDataActions.setUserData(userData))
      localStorage.setItem("CyberTeensUserData", JSON.stringify(userData))
    }
  }
  useEffect(() => {
    if (AuthToken) {
      gettingProfileData()
    }
  }, [])

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<AuthRoute user={AuthToken}> <Login /> </AuthRoute>} />
        <Route path="signup" element={<AuthRoute user={AuthToken}> <Signup /> </AuthRoute>} />
        <Route path="dashboard/*" element={<ProtectedRoute user={AuthToken}>  <MyAccount />  </ProtectedRoute>} />
        <Route path="card" element={<ProtectedRoute user={AuthToken}>  <FlipcardComponent />  </ProtectedRoute>} />
        <Route path="mcqs" element={<IndexMcqs />} />
        <Route path="course" element={<CourseDetail />} />
        <Route path="courses" element={<Course />} />
        <Route path="quizzes" element={<Quiz />} />
      </Routes>

    </>
  )
}

export default App
