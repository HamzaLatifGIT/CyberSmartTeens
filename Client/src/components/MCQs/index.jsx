import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Components :
import Navbar from '../Navbar';
import Footer from '../Footer';
import MCQQuestion from './MCQs';





function IndexMcqs() {
    let Location = useLocation()
    let QuizData = Location?.state

    const [questions, setQuestions] = useState([])



    useEffect(() => {
        if (QuizData) {
            setQuestions(QuizData?.questions?.map(data => ({ question: data?.question, options: data?.options, correctAnswer: data?.answer })))
        }
    }, [QuizData])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Navbar />
            <div className='McqDetail'>
                <div className='McqContainer'>
                    <h1 style={{ display: 'flex', justifyContent: 'center' }}>Cyber Security MCQS</h1>
                    {questions.map((q, index) => (
                        <MCQQuestion
                            key={index}
                            question={q.question}
                            options={q.options}
                            correctAnswer={q.correctAnswer}
                        />
                    ))}
                </div>
                <div className="side-dashboard">

                    <div className="tag">
                        Categories
                    </div>
                    <div className="tagsList"> cyber</div>
                    <div className="tag">
                        Score
                    </div>
                    <div className="detail">
                        <div><strong>Total Mcqs :</strong> <span>5</span></div>
                        <div><strong>Total attempts :</strong> <span>3</span></div>
                        <div><strong>Correct :</strong> <span>1</span></div>
                        <div><strong>Wrong :</strong> <span>2</span></div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default IndexMcqs;
