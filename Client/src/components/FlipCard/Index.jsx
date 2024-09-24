import React, { useState } from "react"

import BottomNav from "./BottomNav"
import FlashCard from "./FlashCard"

import { Grid2 } from "@mui/material"

const App = () => {

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
            flipped:false,
            current: CardsData.current - 1
        })
    }
    const Next = () => {
        setCardsData({
            ...CardsData,
            flipped:false,
            current: CardsData.current + 1
        })
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh" }}>
                <Grid2 item xs={10} sm={8} md={6} xl={4}>
                    <FlashCard
                        id={CardsData.current}
                        front={CardsData.cards[CardsData.current].front}
                        back={CardsData.cards[CardsData.current].back}
                        flipped={CardsData.flipped}
                        handleFlip={Flip}
                    />
                </Grid2>
            </div>
            <BottomNav
                nextCard={Next}
                prevCard={Previous}
            />
        </>
    )
}

export default App