import React, { useEffect, useState, useRef } from 'react';

// MUI | ANT-D :
import { Button, Table, Modal, Image } from 'antd';

// Asserts | ICONS : 
import { BsArrowLeftShort } from "react-icons/bs"
import { MdOutlineSubtitles, MdEdit, MdDelete } from "react-icons/md";
import { LuFileQuestion } from "react-icons/lu";
import { FaUserPen } from "react-icons/fa6";

// API's
import { SubjectivesQuizResultAPI } from '../Api/quiz';
// Helper :
import { toast } from 'react-hot-toast';
import ImgURLGEN from '../Utils/ImgUrlGen';

// CSS :
import './style/SubjectiveDetails.scss';





export default function AddCourse({ allQuizes, selectedQuiz, closeSubPage }) {

  const [quizDetails, setQuizDetails] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [attemptsDetails, setAttemptsDetails] = useState([{
    question: "",
    options: [],
    correctAnswer: "",
    attempt: "",
    isCorrect: false,
  }])

  const [isModalVisible, setIsModalVisible] = useState({
    open: false,
    index: null
  });
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (selectedQuiz) {
      setQuizDetails(selectedQuiz?.quizData)
      setUserDetails(selectedQuiz?.studentData)
      setAttemptsDetails(selectedQuiz?.attempts)
    } else {
      setQuizDetails(null)
      setUserDetails(null)
      setAttemptsDetails([{
        question: "",
        options: [],
        correctAnswer: "",
        attempt: ""
      }])
    }
  }, [selectedQuiz])


  const handleSaveResult = async () => {

    setLoading(true)

    let correct = 0
    let wrong = 0

    let TotalQuestions = quizDetails?.questions.length
    let TotalAttempts = attemptsDetails?.length
    wrong = TotalQuestions - TotalAttempts

    let CheckCorrect = attemptsDetails.map(data => {
      if (data?.isCorrect) {
        correct += 1
      } else {
        wrong += 1
      }
    })

    let Payload = {
      _id: selectedQuiz?._id,
      correct,
      wrong,
      attempts: attemptsDetails
    }

    let res = await SubjectivesQuizResultAPI(Payload)
    if (res.error != null) {
      toast.error(res.error)
    } else {
      toast.success(res.data?.message)
      closeSubPage()
    }
    setLoading(true)
  }

  const columns = [
    {
      title: 'Question Title',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Student Answer',
      dataIndex: 'attempt',
      key: 'attempt',
    },
    {
      title: 'Status',
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      render: (_, data) => data?.isCorrect == true ? "CORRECT" : data?.isCorrect == false ? "WRONG" : "PENDING"
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record, index) => (
        <span>
          <Button
            type="primary"
            icon={<MdEdit />}
            onClick={() => handleViewAttemptClick(record, index)} // Show modal with course details
          >
          </Button>
        </span>
      ),
    },
  ];

  const handleViewAttemptClick = (record, index) => {
    setIsModalVisible({
      open: true,
      index: index
    });
  }

  const handleCloseModal = () => {
    setIsModalVisible({
      open: false,
      index: null
    });
  };

  const handleAttemptStatusChange = (status) => {
    const UpdateAttempts = attemptsDetails.map((data, index) => {
      if (index == isModalVisible?.index) {
        return {
          ...data,
          isCorrect: status
        }
      } else {
        return data
      }
    })

    setAttemptsDetails(UpdateAttempts)
    handleCloseModal()
  }

  return (
    <>
      <div className="SubjectiveDetailsContainer">
        <div className="headingSubjectiveDetails">
          <div className="heading"><BsArrowLeftShort className='icon' onClick={closeSubPage} /> <h2>Open Questions Quiz Detials</h2></div>
        </div>
        <div className="Box">
          <div className="details">
            <div className="userInfo">
              <div className="title">Student Details</div>
              <div className="InputFields">
                <Image
                  className='customePreview'
                  width={120}
                  height={120}
                  src={ImgURLGEN(userDetails?.profileImage)}
                />
                <div className="field"> <b> Name: </b> {userDetails?.firstName} {userDetails?.lastName} </div>
                <div className="field"> <b> Email: </b> {userDetails?.email} </div>
              </div>
            </div>
            <div className="line"></div>
            <div className="quizInfo">
              <div className="title">Quiz Details</div>
              <div className="InputFields">
                <Image
                  className='customePreview'
                  width={120}
                  height={120}
                  src={ImgURLGEN(quizDetails?.image)}
                />
                <div className="field"> <b> Title: </b> {quizDetails?.title} </div>
                <div className="field"> <b> Quote: </b> {quizDetails?.quote} </div>
              </div>
            </div>
          </div>
          <div className="InputFields">
            <div className="field2 field descriptionMain">
              <div className="flex descriptionHeader heading">
                <h3> Attempts </h3>
              </div>
              <div className="descriptionPara">
                <Table dataSource={attemptsDetails} columns={columns} rowKey="title" />
              </div>
            </div>
            {
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Button className="btn" style={{ width: "40px" }} onClick={handleSaveResult} loading={loading}>
                  Submit
                </Button>
              </div>
            }

          </div>
        </div>
      </div>
      <Modal
        title="Attempt Details"
        visible={isModalVisible?.open}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div className='QuizModal'>
          <div className="InputFields">
            <div className="Inputfield">
              <div className="field1 field">
                <div className="lableName">Question</div>
                <p className='question'>
                  <LuFileQuestion fontSize={"1.1rem"} color='black' /> {isModalVisible.index != null && attemptsDetails[isModalVisible?.index].question}
                </p>
              </div>
            </div>
            <div className="Inputfield">
              <div className="field1 field">
                <div className="lableName">Student Answer</div>
                <p className='question'>
                  <FaUserPen fontSize={"1.1rem"} color='black' /> <i> {isModalVisible.index != null && attemptsDetails[isModalVisible?.index].attempt}</i>
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <Button className="btn" style={{ width: "40px" }} loading={loading} onClick={() => handleAttemptStatusChange(true)} >
                CORRECT
              </Button>
              <Button danger className="btn" style={{ width: "40px", backgroundColor: "red" }} loading={loading} onClick={() => handleAttemptStatusChange(false)} >
                WRONG
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
