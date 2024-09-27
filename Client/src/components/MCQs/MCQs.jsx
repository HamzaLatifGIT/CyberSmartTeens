import React, { useState } from 'react';
import './MCQs.scss';

const MCQQuestion = ({ question, options, correctAnswer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswerToggle = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="mcq-question">
      <h2>{question}</h2>
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index} className={showAnswer && option === correctAnswer ? 'correct' : ''}>
            {String.fromCharCode(97 + index)}) {option}
          </li>
        ))}
      </ul>
      <div className="answer-section">
        <button onClick={handleAnswerToggle}>
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
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
