import React from "react"
import { useNavigate } from "react-router-dom"

import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import { makeStyles } from "@mui/styles"

import { GrPrevious, GrNext, GrFormPrevious, GrFormNext } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { MdOutlineNotInterested } from "react-icons/md";

// import AddIcon from "@material-ui/icons/AddToPhotos"

const useStyles = makeStyles({
  displayMode: {
    position: "fixed",
    bottom: 0,
    width: "100%"
  },
  createMode: {
    position: "absolute",
    top: "calc(100% - 56px)",
    width: "100%"
  }
})


export default function SimpleBottomNavigation({
  prevCard,
  nextCard,
  current,
  length
}) {
  const style = useStyles()
  const Navigate = useNavigate()
  console.log(";;;;;;;;;;;;;;;;;;;", current < (length - 1));
  console.log(";;;;;;;;;;;;;;;;;;;", current);
  console.log(";;;;;;;;;;;;;;;;;;;", length);


  return (
    <>
      <div className="actions">
        <div className="actionBtn" style={current <= 0 ? { cursor: "no-drop" } : {}} onClick={current >= 1 && prevCard}>
          {
            current <= 0 ?
              <MdOutlineNotInterested />
              :
              <GrFormPrevious />
          }
          {/* PREV */}
        </div>
        <div className="actionBtn" style={current >= (length - 1) ? { cursor: "no-drop" } : {}} onClick={current < (length - 1) && nextCard}
        >
          {
            current >= (length - 1) ?
              <MdOutlineNotInterested />
              :
              <GrFormNext />
          }
          {/* NEXT */}
        </div>
      </div>
    </>
    //<>
    //   {!prevCard && ( // if no props are passed, we are in create mode
    //     <BottomNavigation showLabels className={style.createMode}>
    //       <BottomNavigationAction
    //         label="Cancel"
    //         icon={<IoMdClose />}
    //         onClick={() => Navigate("-1")}
    //       />
    //     </BottomNavigation>
    //   )}
    //   {prevCard && ( // if props exist, we are in display mode
    //     <BottomNavigation showLabels className={style.displayMode}>
    //       <BottomNavigationAction
    //         label="Previous"
    //         icon={<GrPrevious />}
    //         onClick={prevCard}
    //       />
    //       {/* <BottomNavigationAction
    //         label="New Card"
    //         icon={<AddIcon />}
    //         onClick={() => history.push("/create-new-flashcard")}
    //       /> */}
    //       <BottomNavigationAction
    //         label="Next"
    //         icon={<GrNext />}
    //         onClick={nextCard}
    //       />
    //     </BottomNavigation>
    //   )}

    // </>
  )
}
