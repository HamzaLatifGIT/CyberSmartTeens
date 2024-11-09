import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// ANT-D :
import { Button } from "antd"

// Components :
import FlashCardContainer from "./FlashCard"
import Navbar from "../Navbar"
import Footer from "../Footer"

// APIs :
// Helpers :
import ImgURLGen from "../../Utils/ImgUrlGen"

// CSS :
import "./index.scss"
import { GetAllPublicQuizesAPI } from "../../Api/quiz"
import { GetAllPublicCoursesAPI } from "../../Api/course"





const App = () => {

    const Navigate = useNavigate()
    const Location = useLocation()

    const QuizData = Location?.state?.data
    // const AllQuizzes = Location?.state?.AllQuizzes

    console.log(QuizData);

    const [AllQuizzes, setAllQuizzes] = useState([])
    const [AllCourses, setAllCourses] = useState([])

    const [FlashCardsData, SetFlashCardsData] = useState([])
    const [TrueFalseData, SetTrueFalseData] = useState([])
    const [OpenQuestionsData, SetOpenQuestionsData] = useState([])
    const [MCQsData, SetMCQsData] = useState([])


    const ViewCourseDetails = (quiz) => {
        Navigate("/course", { state: { data: quiz, AllQuizzes: AllQuizzes } })
    }
    const ViewQuizDetails = (quiz) => {
        Navigate("/card", { state: { data: quiz } })
    }
    const ViewAttemptDetails = () => {
        Navigate("/mcqs", { state: { QuizDetails: QuizData, MCQsData, TrueFalseData, OpenQuestionsData } })
    }

    useEffect(() => {
        if (QuizData?.type == "flash") {
            SetFlashCardsData([QuizData])
        } else if (QuizData) {
            let FindFlashCardsQuizzes = QuizData?.quizzes?.filter(data => data?.type == "flash")
            let FindTrueFalseQuizzes = QuizData?.quizzes?.filter(data => data?.type == "true")
            let FindOpenQuestionQuizzes = QuizData?.quizzes?.filter(data => data?.type == "open")
            let FindMCQQuizzes = QuizData?.quizzes?.filter(data => data?.type == "mcq")

            if (FindFlashCardsQuizzes?.length >= 1) {
                SetFlashCardsData(FindFlashCardsQuizzes)
            } else {
                SetFlashCardsData([])
            }

            if (FindTrueFalseQuizzes?.length >= 1) {
                SetTrueFalseData(FindTrueFalseQuizzes)
            } else {
                SetTrueFalseData([])
            }

            if (FindOpenQuestionQuizzes?.length >= 1) {
                SetOpenQuestionsData(FindOpenQuestionQuizzes)
            } else {
                SetOpenQuestionsData([])
            }
            if (FindMCQQuizzes?.length >= 1) {
                SetMCQsData(FindMCQQuizzes)
            } else {
                SetMCQsData([])
            }
        }
    }, [QuizData])

    const getAllQuizzes = async () => {
        const response = await GetAllPublicCoursesAPI();
        if (response.error != null) {

        } else {
            setAllCourses(response?.data?.result || [])
        }
    };
    const getAllCourses = async () => {
        const response = await GetAllPublicQuizesAPI();
        if (response.error != null) {

        } else {
            setAllQuizzes(response?.data?.result || [])
        }
    };
    useEffect(() => {
        getAllQuizzes()
        getAllCourses()
        window.scroll(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <div className="QuizContainer">
                <div className="QuizBox">
                    <div className="post-header">
                        <div className="date">PUBLISHED ON: Sep 27, 2024</div>
                    </div>
                    <div className="post-image">
                        <img src={ImgURLGen(QuizData?.image)} alt="" />
                    </div>
                    <h1 className="post-title">{QuizData?.title}</h1>
                    <div className="Quizzes">
                        {
                            FlashCardsData?.length >= 1 &&
                            <>
                                <div className="FlashCardBox">
                                    <div className="title"> FLASH CARDS </div>
                                    {
                                        FlashCardsData.map((data, index) => {
                                            return (
                                                <>
                                                    <div className="FlashCard">
                                                        <div className="subTitle">
                                                            {data?.title}
                                                        </div>
                                                        <FlashCardContainer key={index} CardsState={data} />
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }
                        {
                            MCQsData?.length >= 1 &&
                            <>
                                <div className="MCQBox">
                                    <div className="title"> MCQs Quizzes </div>
                                    {
                                        MCQsData.map((data, index) => {
                                            return (
                                                <>
                                                    <div className="MCQ">
                                                        <div className="subTitle">
                                                            {index + 1}.  {data?.title}
                                                        </div>
                                                        {/* <Button className="btn" onClick={() => ViewAttemptDetails(data)}> Attempt </Button> */}
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }
                        {
                            TrueFalseData?.length >= 1 &&
                            <>
                                <div className="TrueFalseBox">
                                    <div className="title"> True-False Quizzes </div>
                                    {
                                        TrueFalseData.map((data, index) => {
                                            return (
                                                <>
                                                    <div className="TrueFalse">
                                                        <div className="subTitle">
                                                            {index + 1}.  {data?.title}
                                                        </div>
                                                        {/* <Button className="btn" onClick={() => ViewAttemptDetails(data)}> Attempt </Button> */}
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }
                        {
                            OpenQuestionsData?.length >= 1 &&
                            <>
                                <div className="OpenQuestionBox">
                                    <div className="title"> Open / Subjective Quizzes </div>
                                    {
                                        OpenQuestionsData.map((data, index) => {
                                            return (
                                                <>
                                                    <div className="OpenQuestion">
                                                        <div className="subTitle">
                                                            {index + 1}. {data?.title}
                                                        </div>
                                                        {/* <Button className="btn" onClick={() => ViewAttemptDetails(data)}> Attempt </Button> */}
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        }
                        {
                            [...MCQsData, ...TrueFalseData, ...OpenQuestionsData].length >= 1 &&
                            <Button className="attemptBtn" onClick={() => ViewAttemptDetails()}> Attempt </Button>
                        }
                    </div>
                    <div className="post-content">
                        {/* <blockquote className="quote">
                            <span>“</span> {QuizData?.quote} <span>”</span>
                        </blockquote> */}
                        <div className="courseContent" dangerouslySetInnerHTML={{ __html: QuizData?.detail }} />
                    </div>
                </div>
                <div className="sidebar">
                    <div className="tags">
                        Categories
                    </div>
                    <div className="tagsList">
                        {
                            QuizData?.categories?.map((cat, index) => <div key={index} className="tag">{cat?.name}</div>)
                        }
                    </div>
                    <div className="popular-posts">
                        <div className="tags">Recent Added Courses</div>
                        {
                            AllCourses?.map((data, index) => {
                                return (
                                    <div className="popular-post" key={index} onClick={() => ViewCourseDetails(data)}>
                                        <img src={data?.image && ImgURLGen(data?.image)} alt="Popular post" />
                                        <div className="popular-post-content">
                                            <h4>{data?.title}</h4>
                                            <p>{data?.quote?.length >= 49 ? `${data?.quote?.slice(0, 49)} ...` : data?.quote}</p>
                                            <span>Sep 27, 2024</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="popular-posts">
                        <div className="tags">Recent Added Quizzes</div>
                        {
                            AllQuizzes?.map((data, index) => {
                                return (
                                    data?._id != QuizData?._id &&
                                    <div className="popular-post" key={index} onClick={() => ViewQuizDetails(data)}>
                                        <img src={data?.image && ImgURLGen(data?.image)} alt="Popular post" />
                                        <div className="popular-post-content">
                                            <h4>{data?.title}</h4>
                                            <p>{data?.quote?.length >= 49 ? `${data?.quote?.slice(0, 49)} ...` : data?.quote}</p>
                                            <span>Sep 27, 2024</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* <BottomNav
                nextCard={Next}
                prevCard={Previous}
            /> */}
            <Footer />
        </>
    )
}

export default App
