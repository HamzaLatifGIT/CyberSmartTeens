import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Components
import Login from '../src/Auth/Login'
import Signup from '../src/Auth/Signup'
import Home from "./components/pages/Home";
import MyAccount from "./components/MyAccount";

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
      </Routes>

    </>
  )
}

export default App
