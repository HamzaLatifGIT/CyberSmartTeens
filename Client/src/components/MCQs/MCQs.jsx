import React, { useState } from "react";

const MCQQuestion = ({ question, options, correctAnswer, onAnswerChange, selectedData, submited }) => {
  const questionData = { question, options, correctAnswer };
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswerToggle = () => {
    setShowAnswer(!showAnswer);
  };

  const handleOptionChange = (questionData, option) => {
    setSelectedData({ ...questionData, attempt: option });
  };

  return (
    <div className="mcq-question" style={submited ? { cursor: "no-drop" } : {}}>
      <h2>{question}</h2>
      <ul className="options-list">
        {options.map((option, index) => (
          <li
            key={index}
            className={showAnswer && option === correctAnswer ? "correct" : ""}
          >
            <input
              type="radio"
              name={`question-${question}`}
              checked={selectedData?.attempt === option}
              onChange={() => onAnswerChange(option)}
            />
            {String.fromCharCode(97 + index)}) {option}
          </li>
        ))}
      </ul>
      <div className="answer-section">
        <button onClick={handleAnswerToggle}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
        {showAnswer && (
          <div className="answer">
            <span className="answer-text">{correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQQuestion;
