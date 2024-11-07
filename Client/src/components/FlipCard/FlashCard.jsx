import React, { useEffect, useState } from "react"
import Flip from "react-card-flip"


import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  IconButton,
} from "@mui/material"
import { makeStyles } from "@mui/styles"

import BottomNav from "./BottomNav"


const useStyles = makeStyles({
  root: {
    "& .MuiCardHeader-root": {
      color: "#EEEEEE",
      background:
        "radial-gradient(circle at 17% 1%, rgba(198, 198, 198,0.03) 0%, rgba(198, 198, 198,0.03) 50%,rgba(42, 42, 42,0.03) 50%, rgba(42, 42, 42,0.03) 100%),radial-gradient(circle at 8% 81%, rgba(253, 253, 253,0.03) 0%, rgba(253, 253, 253,0.03) 50%,rgba(36, 36, 36,0.03) 50%, rgba(36, 36, 36,0.03) 100%),radial-gradient(circle at 83% 29%, rgba(164, 164, 164,0.03) 0%, rgba(164, 164, 164,0.03) 50%,rgba(60, 60, 60,0.03) 50%, rgba(60, 60, 60,0.03) 100%),radial-gradient(circle at 96% 62%, rgba(170, 170, 170,0.03) 0%, rgba(170, 170, 170,0.03) 50%,rgba(169, 169, 169,0.03) 50%, rgba(169, 169, 169,0.03) 100%),linear-gradient(338deg, rgb(2, 141, 213),rgb(5, 172, 81))"
    }, //BOTTOM CONTENT OF FLASHCARD
    "& .MuiCardContent-root": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(45deg, rgba(86, 86, 86,0.04) 0%, rgba(86, 86, 86,0.04) 50%,rgba(169, 169, 169,0.04) 50%, rgba(169, 169, 169,0.04) 71%,rgba(251, 251, 251,0.04) 71%, rgba(251, 251, 251,0.04) 100%), linear-gradient(45deg, rgba(86, 86, 86,0.04) 0%, rgba(86, 86, 86,0.04) 56%,rgba(169, 169, 169,0.04) 56%, rgba(169, 169, 169,0.04) 67%,rgba(251, 251, 251,0.04) 67%, rgba(251, 251, 251,0.04) 100%), linear-gradient(135deg, rgba(86, 86, 86,0.04) 0%, rgba(86, 86, 86,0.04) 4%,rgba(169, 169, 169,0.04) 4%, rgba(169, 169, 169,0.04) 75%,rgba(251, 251, 251,0.04) 75%, rgba(251, 251, 251,0.04) 100%), linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0))",
      color: "#EEEEEE",
      minHeight: "300px"
    }, //TRASHCAN ICON COLOR
    "& .MuiButtonBase-root": {
      color: "white"
    }, //TRASHCAN ICON ALIGNMENT
    "& .MuiCardHeader-action": {
      alignSelf: "auto",
      marginTop: 0,
      marginLeft: 8
    }
  }
})

const FlashCard = ({ id, front, back, flipped, handleFlip }) => {
  const classes = useStyles() // MATERIAL UI STYLING

  return (
    <div id={`${id + 1}`}>
      <Flip isFlipped={flipped} flipDirection="vertical">
        <Card
          className={classes.root}
          elevation={24} // MUI Box Shadow
          key="front"
          /* style={styles.card} */
          onClick={handleFlip}
        >
          <CardHeader
            // action={
            //   <IconButton
            //     aria-label="delete"
            //     onClick={() => dispatch(deleteFlashCard())}
            //   >
            //     <DeleteIcon />
            //   </IconButton>
            // }
            title={front.title}
            className={classes.root}
          /* style={styles.card.header} */
          />
          <CardContent>{front.content}</CardContent>
        </Card>

        <Card
          key="back"
          className={classes.root}
          elevation={24} // MUI Box Shadow
          /* style={styles.card} */
          onClick={handleFlip}
        >
          <CardHeader
            // action={
            //   <IconButton
            //     aria-label="delete"
            //     onClick={() => dispatch(deleteFlashCard())}
            //   >
            //     <DeleteIcon />
            //   </IconButton>
            // }
            title={back.title}
            className={classes.root}
          /* style={styles.card.header} */
          />
          <CardContent>{back.content}</CardContent>
        </Card>
      </Flip>
    </div>
  )
}

const FlashCardContainer = ({ CardsState }) => {

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
      <Grid2 item xs={10} sm={8} md={6} xl={4}>
        <FlashCard
          id={CardsData.current}
          front={CardsData.cards[CardsData.current].front}
          back={CardsData.cards[CardsData.current].back}
          flipped={CardsData.flipped}
          handleFlip={Flip}
        />
      </Grid2>
      <BottomNav
        nextCard={Next}
        prevCard={Previous}
        current={CardsData?.current}
        length={CardsData?.cards?.length}
      />
    </>
  )
}

export default FlashCardContainer
