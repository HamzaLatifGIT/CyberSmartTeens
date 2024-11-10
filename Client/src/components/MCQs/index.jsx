import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Components :
import Navbar from "../Navbar";
import Footer from "../Footer";
import Attempt from "./Attempt"

// CSS :
import "./Index.scss";
import { Button } from "antd";





function IndexMcqs() {
    let location = useLocation();
    let { QuizDetails, MCQsData, TrueFalseData, OpenQuestionsData } = location?.state;

    const [ScoreList, setScoreList] = useState({})
    const [clicked, setIsClicked] = useState(false)

    const HandleSaveScore = (score) => {
        setScoreList({
            ...ScoreList,
            ...score
        })
    }

    return (
        <>
            <Navbar />
            <div className="AttemptPage">
                <div className="AttemptBox">
                    {
                        MCQsData?.length >= 1 &&
                        <>
                            <div className="title">
                                MCQs Quizzes
                            </div>
                            {
                                MCQsData?.map((data, index) => {
                                    return (
                                        <Attempt clicked={clicked} data={data} SaveScore={HandleSaveScore} />
                                    )
                                })
                            }
                        </>

                    }
                    {
                        TrueFalseData?.length >= 1 &&
                        <>
                            <div className="title">
                                True-False Quizzes
                            </div>
                            {
                                TrueFalseData?.map((data, index) => {
                                    return (
                                        <Attempt clicked={clicked} data={data} SaveScore={HandleSaveScore} />
                                    )
                                })
                            }
                        </>

                    }
                    {
                        OpenQuestionsData?.length >= 1 &&
                        <>
                            <div className="title">
                                Open Questions Quizzes
                            </div>
                            {
                                OpenQuestionsData?.map((data, index) => {
                                    return (
                                        <Attempt clicked={clicked} data={data} SaveScore={HandleSaveScore} />
                                    )
                                })
                            }
                        </>

                    }
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button style={clicked ? { cursor: "no-drop" } : {}} className="attemptBtn" onClick={()=> setIsClicked(true)}>
                            {clicked ? "Submited" : "Submit"}
                        </Button>
                    </div>
                </div>
                <div className="sidebar">
                    <div className="tags">Quiz Details</div>
                    <div className="quizDetails">
                        {/* <img src={ImgURL(QuizDetails?.image)} alt="" /> */}
                        <img src="http://localhost:5173/src/assets/360_F_230307061_W3AAOhexkQjFgjwx0AhffaVi5VQcvpHI.jpg" alt="" />
                        <div className="title"> {QuizDetails?.title} </div>
                        <div className="quote"> {QuizDetails?.quote} </div>
                        {
                            MCQsData?.length >= 1 &&
                            <>
                                <div className="tags">
                                    MCQs Quiz Score
                                </div>
                                {
                                    MCQsData?.map((data, index) => {
                                        return (
                                            <>
                                                <div className="quiz">
                                                    <p>
                                                        {index + 1}. {data?.title}
                                                    </p>
                                                    <p className="score"> <i>{ScoreList[data._id] ?? 0}</i> / {data?.questions?.length} </p>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </>

                        }
                        {
                            TrueFalseData?.length >= 1 &&
                            <>
                                <div className="tags">
                                    True-False Quiz Score
                                </div>
                                {
                                    TrueFalseData?.map((data, index) => {
                                        return (
                                            <>
                                                <div className="quiz">
                                                    <p>
                                                        {index + 1}. {data?.title}
                                                    </p>
                                                    <p className="score"> <i>{ScoreList[data._id] ?? 0}</i> / {data?.questions?.length} </p>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </>

                        }
                        {
                            OpenQuestionsData?.length >= 1 &&
                            <>
                                <div className="tags">
                                    Open Questions Quiz Score
                                </div>
                                {
                                    OpenQuestionsData?.map((data, index) => {
                                        return (
                                            <>
                                                <div className="quiz">
                                                    <p>
                                                        {index + 1}. {data?.title}
                                                    </p>
                                                    <p className="score"> <i>{ScoreList[data._id] ?? 0}</i> / {data?.questions?.length} </p>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </>

                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default IndexMcqs;
