import React, { useState } from "react";

const MCQQuestion = ({ number, question, options, correctAnswer, onAnswerChange, selectedData, submited }) => {

  return (
    <div className="mcq-question" style={submited ? { cursor: "no-drop" } : {}}>
      <h2>Q.{number + 1} <i> {question} </i> </h2>
      <div className="answerBox">
        <div className="InputFields">
          <div className="Inputfield">
            <div className="field1 field">
              <div className="lableName">Answer</div>
              <textarea
                className='blogInput'
                type="text"
                placeholder='write answer'
                name={`question-${question}`}
                value={selectedData?.attempt}
                onChange={(e) => onAnswerChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQQuestion;
