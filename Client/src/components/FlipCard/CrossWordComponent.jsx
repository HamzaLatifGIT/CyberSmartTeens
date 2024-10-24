import React, { useRef } from "react"

import Crossword, { ThemeProvider } from '@jaredreisinger/react-crossword';
import { Button } from "antd";



const CrossWordComponent = ({ code }) => {

  const crosswordRef = useRef();

  const fillAnswers = () => {
    if (crosswordRef.current) {
      crosswordRef.current.fillAllAnswers()
    }
  };

  const data = {
    "across": {
      "1": { "clue": "Secure communication protocol for the web", "answer": "HTTPS", "row": 0, "col": 0 },
      "2": { "clue": "Unauthorized access to data", "answer": "HACKING", "row": 0, "col": 5 },
      "3": { "clue": "Malicious software", "answer": "SECURITY", "row": 2, "col": 0 },
      "7": { "clue": "Malicious software", "answer": "RANSOMWARE", "row": 3, "col": 5 }
    },
    "down": {
      "1": { "clue": "Technique for disguising digital data", "answer": "HASH", "row": 0, "col": 0 },
      "4": { "clue": "Virus", "answer": "ATTACK", "row": 0, "col": 6 },
      "5": { "clue": "Virus", "answer": "TROGEN", "row": 1, "col": 4 },
      "6": { "clue": "Virus", "answer": "VIRUS", "row": 1, "col": 5 }
    }
  };


  return (
    <>
      <div style={{ width: "400px", margin: "auto" }}>
        <ThemeProvider theme={{}}>
          <Crossword data={code ? JSON.parse(code) : data} useStorage={false} ref={crosswordRef} />
        </ThemeProvider>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button className="btn" onClick={fillAnswers}>Fill Answers</Button>
        </div>
      </div>
    </>
  )
}

export default CrossWordComponent
