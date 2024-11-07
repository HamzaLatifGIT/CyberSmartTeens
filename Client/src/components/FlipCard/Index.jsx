import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import BottomNav from "./BottomNav"
import FlashCardContainer from "./FlashCard"
import CrossWordComponent from "./CrossWordComponent"

import { Grid2 } from "@mui/material"
import Navbar from "../Navbar"
import Footer from "../Footer"
import ImgURLGen from "../../Utils/ImgUrlGen"
import "./index.scss"
import { Button } from "antd"
import { GrFormPrevious, GrFormNext } from "react-icons/gr";




const App = () => {

    const Navigate = useNavigate()
    const Location = useLocation()

    const QuizData = Location?.state?.data
    const AllQuizzes = Location?.state?.AllQuizzes

    console.log(QuizData);

    const [FlashCardsData, SetFlashCardsData] = useState([])


    const ViewDetails = (quiz) => {
        // if (quiz?.type == "flash" || quiz?.type == "puzzle") {
        //     Navigate("/card", { state: { data: quiz, AllQuizzes: AllQuizzes } })
        // } else if (quiz?.type == "mcq" || quiz?.type == "open" || quiz?.type == "true") {
        //     Navigate("/mcqs", { state: quiz })
        // }
        Navigate("/card", { state: { data: quiz, AllQuizzes: AllQuizzes } })
    }

    useEffect(() => {
        if (QuizData) {

            let FindFlashCardsQuizzes = QuizData?.quizzes?.find(data => data?.type == "flash")
            if (FindFlashCardsQuizzes?.length >= 1) {
                SetFlashCardsData(FindFlashCardsQuizzes)
            } else {
                SetFlashCardsData([])
            }
        }
    }, [QuizData])
    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <div className="FlashCardContainer">
                <div className="FlashCardBox">
                    <div className="post-header">
                        <div className="date">PUBLISHED ON: Sep 27, 2024</div>
                    </div>
                    <h1 className="post-title">{QuizData?.title}</h1>
                    {
                        FlashCardsData?.length >= 1 &&
                        <>
                            <div className="flashCardBox">
                                <div className="title"> FLASH CARDS </div>
                                {
                                    FlashCardsData.map((data, index) => {
                                        return (
                                            <>
                                                <div className="subTitle">
                                                    {data?.title}
                                                </div>
                                                <FlashCardContainer key={index} CardsState={data} />
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </>
                    }
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
                            AllQuizzes?.map((data, index) => {
                                return (
                                    <div className="popular-post" key={index} onClick={() => ViewDetails(data)}>
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
