import React, { useRef } from "react"

import Crossword, { ThemeProvider } from '@jaredreisinger/react-crossword';



const CrossWordComponent = () => {

  const crosswordRef = useRef();

  const fillAnswers = () => {
    if (crosswordRef.current) {
      crosswordRef.current.fillAllAnswers()
    }
  };
  // const fillAnswers = () => {
  //   if (crosswordRef.current) {
  //     Object.keys(data.across).forEach((key) => {
  //       const { answer, row, col } = data.across[key];
  //       crosswordRef.current.setGuess(row, col, answer);
  //     });
  //     Object.keys(data.down).forEach((key) => {
  //       const { answer, row, col } = data.down[key];
  //       crosswordRef.current.setGuess(row, col, answer);
  //     });
  //   }
  // };

  const data = {
    across: {
      1: { clue: "Unauthorized access attempt", answer: "HACK", row: 0, col: 0 },
      5: { clue: "Malicious software", answer: "MALWARE", row: 0, col: 5 },
      7: { clue: "Technique to steal personal data", answer: "PHISHING", row: 2, col: 0 },
      9: { clue: "Encrypts data for ransom", answer: "RANSOMWARE", row: 4, col: 1 },
    },
    down: {
      1: { clue: "Online attack involving overwhelming traffic", answer: "DDOS", row: 1, col: 0 },
      2: { clue: "Malicious program disguised as legitimate software", answer: "TROJAN", row: 0, col: 5 },
      3: { clue: "Unauthorized control over a system", answer: "EXPLOIT", row: 0, col: 7 },
      4: { clue: "Cryptographic key management technique", answer: "KEY", row: 2, col: 3 },
      6: { clue: "Phishing method via mobile SMS", answer: "SMISHING", row: 2, col: 8 },
    },
  };


  return (
    <>
      <div style={{ width: "400px", margin: "auto" }}>
        <ThemeProvider theme={{}}>
          <Crossword data={data} useStorage={false} ref={crosswordRef} />
        </ThemeProvider>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={fillAnswers}>Fill Answers</button>
        </div>
      </div>
    </>
  )
}

export default CrossWordComponent
