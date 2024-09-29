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
            <Footer />
        </>
    );
}

export default IndexMcqs;
