import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ANT-D :
import { DeleteOutlined, EditOutlined, EyeFilled } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';

// Components :
import SubjectiveDetaiils from './SubjectivesDetails';

// APIs :
import { DeleteQuizAPI, GetAllQuizzesResultsAPI, GetAllSubjectivesAPI } from '../Api/quiz';
// Helpers :
import toast from 'react-hot-toast';

// CSS :
import './style/Quiz.scss';





const Result = () => {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // To store selected quiz details
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);


  const columns = [
    {
      title: 'Quiz Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, data) => data?.title
    },
    {
      title: 'Quote',
      dataIndex: 'quote',
      key: 'quote',
      render: (_, data) => data?.quote
    },
    {
      title: 'Types',
      dataIndex: 'types',
      key: 'types',
      render: (types) => types?.length >= 1 && types.join(" , "), // Formatting the date
    },
    {
      title: 'Obtained Score',
      dataIndex: 'correct',
      key: 'correct',
      render: (_, data) => {
        let correct = 0
        data?.Results?.map(res => { correct = correct + res.correct })
        return correct
      }, // Formatting the date
    },
    {
      title: 'Total Score',
      dataIndex: 'correct',
      key: 'correct',
      render: (_, data) => {
        let total = 0
        data?.Results?.map(res => { total = total + res.quizData?.questions?.length })
        return total
      }, // Formatting the date
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (_, record) => (
    //     <span>
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
    //         onClick={() => ViewQuiz(record)}
    //       >
    //         View
    //       </Button>
    //     </span>
    //   ),
    // },
  ];


  // Fetch quizzes when component mounts
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const result = await GetAllQuizzesResultsAPI();
      if (result.error) {
        toast.error(result.error);
      } else {
        let AlLAttempts = result.data.result?.quizAttempts || [];
        let AllQuizzes = []

        AlLAttempts.forEach(function (x) {
          console.log("==========", x);
          let ResultPayload = {
            correct: x?.correct,
            wrong: x?.wrong,
            quizId: x.quizId,
            quizData: x.quizData?.quizzes?.find(q => q?._id == x?.quizId)
          }
          let FindQuiz = AllQuizzes.find(data => data?._id == x?.quizData?._id)
          if (FindQuiz) {
            AllQuizzes = AllQuizzes.map(d => {
              if (d?._id == x?.quizData?._id) {
                return {
                  ...d,
                  Results: [...d?.Results, ResultPayload]
                }
              } else {
                return d
              }
            })
          } else {
            AllQuizzes.push({ ...x?.quizData, Results: [ResultPayload] })
          }
        })

        setResults(AllQuizzes)
      }
      setLoading(false);
    };
    fetchResults();
  }, [refresh]);

  const handleAddQuizClick = () => {
    setIsAddingQuiz(true);
  };
  const ViewQuiz = (record) => {
    setSelectedQuiz(record);
    setIsAddingQuiz(true);
  };
  const ClosePage = () => {
    setIsAddingQuiz(false)
    setSelectedQuiz(null);
    setRefresh(!refresh)
  }


  return (
    <div>
      {isAddingQuiz ? (
        <SubjectiveDetaiils selectedQuiz={selectedQuiz} closeSubPage={ClosePage} />
      ) : (
        <div>
          <div className="flex">
            <h2>Attempts Results</h2>
          </div>
          <Table loading={loading} dataSource={results} columns={columns} rowKey="_id" />
        </div>
      )}
    </div>
  );
};

export default Result;
