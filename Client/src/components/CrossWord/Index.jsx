import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import CrossWordComponent from "./CrossWordComponent"

import Navbar from "../Navbar"
import Footer from "../Footer"
import ImgURLGen from "../../Utils/ImgUrlGen"
import "./index.scss"





const App = () => {

    const Navigate = useNavigate()
    const Location = useLocation()

    const CardsState = Location?.state?.data
    const AllQuizzes = Location?.state?.AllQuizzes

    console.log(CardsState);


    const [CardsData, setCardsData] = useState({
        current: 0, // index of current visible card
        flipped: false,
        cards: [
            {
                // State is an Array of Flashcards With a Front and Back. The id is the array index
                id: 0,
                front: {
                    title: "Question 1",
                    content: "What is Redux Toolkit? (click anywhere on the card to flip)"
                },
                back: {
                    title: "",
                    content:
                        "Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development and is intended to be the standard way to write Redux logic."
                }
            },
            {
                // State is an Array of Flashcards With a Front and Back. The id is the array index
                id: 1,
                front: {
                    title: "About This Project",
                    content:
                        "This project was built with React, React-Router, Redux, Redux Toolkit, React-Redux & a Custom Designed MaterialUI Theme"
                },
                back: {
                    title: "More info",
                    content:
                        "Click the GitHub icon in the top right of the screen to view the source code!"
                }
            }
        ]
    })

    const Flip = () => {
        setCardsData({
            ...CardsData,
            flipped: !CardsData.flipped
        })
    }
    const Previous = () => {
        setCardsData({
            ...CardsData,
            flipped: false,
            current: CardsData.current - 1
        })
    }
    const Next = () => {
        setCardsData({
            ...CardsData,
            flipped: false,
            current: CardsData.current + 1
        })
    }

    const ViewDetails = (quiz) => {
        if (quiz?.type == "flash" || data?.type == "puzzle") {
            Navigate("/card", { state: { data: quiz, AllQuizzes: AllQuizzes } })
        } else {
            Navigate("/mcqs", { state: quiz })
        }
    }

    useEffect(() => {
        if (CardsState) {
            setCardsData({
                ...CardsData,
                cards: CardsState?.questions.map((data, index) => ({ id: index, front: { title: `Card No. ${index + 1}`, content: data?.question }, back: { title: `Answer`, content: data?.answer } }))
            })
        }
    }, [CardsState])

    return (
        <>
            <Navbar />
            <div className="FlashCardContainer">
                <div className="FlashCardBox">
                    <div className="post-header">
                        <div className="date">PUBLISHED ON: Sep 27, 2024</div>
                    </div>
                    <h1 className="post-title">{CardsState?.title || "Cyber Security Crossword Puzzle"}</h1>
                    <CrossWordComponent />
                    <div className="post-content">
                        <blockquote className="quote">
                            <span>“</span> {CardsState?.quote || "The puzzle encourages analytical thinking, aiding in the development of skills needed to identify and mitigate cyber risks"} <span>”</span>
                        </blockquote>
                        <div className="courseContent" dangerouslySetInnerHTML={{ __html: CardsState?.detail }} />
                    </div>
                </div>
                <div className="sidebar">
                    <div className="tags">
                        Categories
                    </div>
                    <div className="tagsList">
                        {
                            CardsState?.categories?.map((cat, index) => <div key={index} className="tag">{cat?.name}</div>)
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
