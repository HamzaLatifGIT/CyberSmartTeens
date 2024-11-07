import React, { useEffect, useState } from 'react';

// ANT-D :
import { Button, Spin, Table } from 'antd';

// ICONS :
import { UserOutlined } from '@ant-design/icons';

// Components :
import UserActivityLineChart from './chart';

// APIs :
import { GetAllStudentsAPI, GetDashboardStatisticsAPI } from '../Api/auth';
import { GetAllPublicQuizesAPI } from '../Api/quiz';
// Redux :
import { useSelector } from "react-redux";
// Helpers :
import toast from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

// CSS :
import './style/dashboard.scss';
import { useNavigate } from 'react-router-dom';





function Dashboard() {
  let Navigate = useNavigate()
  let UserData = useSelector(state => state?.userData)

  const [statistics, setStatistics] = useState(null);
  const [quizzes, setQuizzes] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)


  const handleStartQuiz = (data) => {
    // if (data?.type == "flash" || data?.type == "puzzle") {
    //   Navigate("/card", { state: { data: data, AllQuizzes: quizzes } })
    // } else if (data?.type == "mcq" || data?.type == "open" || data?.type == "true") {
    //   Navigate("/mcqs", { state: data })
    // }
    Navigate("/card", { state: { data: data, AllQuizzes: quizzes } })
  }
  const quizColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (_, record) => (record?.categories?.map(cat => cat?.name)).join(",")
    },
    {
      title: 'Types',
      dataIndex: 'types',
      key: 'types',
      render: (_, record) => (record?.types?.join(" , ")?.toLocaleUpperCase())
    },
    {
      title: 'Number of Quizzes',
      dataIndex: 'questions',
      key: 'questions',
      render: (_, record) => record?.quizzes?.length || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          // icon={<EyeOutlined />}
          onClick={() => handleStartQuiz(record)}
        >
          Start Quiz
        </Button>
      ),
    },
  ];
  const studentColumns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => `${record?.firstName} ${record?.lastName}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Score',
      dataIndex: 'Score',
      key: 'Score',
    },
  ];


  const gettingStatistics = async () => {
    setLoading(true);
    const result = await GetDashboardStatisticsAPI();
    if (result.error != null) {
      toast.error(result.error);
    } else {
      setStatistics(result?.data?.result || null);
    }
    setLoading(false);
  }
  const gettingQuizzes = async () => {
    setLoading(true);
    const result = await GetAllPublicQuizesAPI();
    if (result.error != null) {
      toast.error(result.error);
    } else {
      setQuizzes(result?.data?.result || []);
    }
    setLoading(false);
  }
  const gettingStudentsData = async () => {
    setLoading(true);
    const result = await GetAllStudentsAPI();
    if (result.error != null) {
      toast.error(result.error);
    } else {
      let StudentData = []
      let processData = result?.data?.result?.map(async user => {
        let score = 0
        let process = user?.quizAttempts?.map(data => {
          score = score + data?.correct
        })
        await Promise.all(process)
        StudentData.push({
          ...user,
          Score: score
        })
      })
      await Promise.all(processData)
      setStudents(StudentData);
    }
    setLoading(false);
  }
  useEffect(() => {
    gettingStatistics()
    gettingQuizzes()
    gettingStudentsData()
  }, [])

  return (
    <div className='dashboard-container'>
      <div className="heading"><h1>{UserData?.role === 'Teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}</h1></div>
      <div className="dashboard-content">
        <div className="boxs">
          {
            loading == true && !statistics?.Cards ?
              <>
                <div className="box">
                  <h3>{UserData?.role === 'Teacher' ? 'Total Student' : 'Total Quizzes'}</h3>
                  <span><Spin /></span>
                </div>
                <div className="box">
                  <h3>{UserData?.role === 'Teacher' ? 'Total Lessons' : 'Total Attempts'}</h3>
                  <span><Spin /></span>
                </div>
                <div className="box">
                  <h3>{UserData?.role === 'Teacher' ? 'Total Quizzes' : 'Total Score'}</h3>
                  <span><Spin /></span>
                </div>
              </>
              :
              statistics?.Cards?.map((data, index) => {
                return (
                  <div className="box" key={index}>
                    <h3>{data?.title} </h3>
                    <span>{data?.value}</span>
                  </div>
                )
              })
          }
        </div>
        <div className="charts">
          <UserActivityLineChart />
        </div>

        <div className="Table">
          {/* <MyTable /> */}
          {
            UserData?.role == "Teacher" ?
              <Table columns={studentColumns} dataSource={students} pagination={false} loading={loading} />
              :
              <Table columns={quizColumns} dataSource={quizzes} pagination={false} loading={loading} />
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;