import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Button } from 'antd';

// Components :
import Navbar from '../Navbar';
import Footer from '../Footer';
import MCQQuestion from './MCQs';

function IndexMcqs() {
    let location = useLocation();
    let quizData = location?.state;

    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (quizData) {
            setQuestions(
                quizData?.questions?.map((data) => ({
                    question: data?.question,
                    options: data?.options,
                    correctAnswer: data?.answer,
                }))
            );
        }
    }, [quizData]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const handleAnswerChange = (index, answer) => {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[index] = answer;
        setUserAnswers(newUserAnswers);
    };


    const handleSubmit = () => {
        let newScore = 0;
        questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                newScore += 1;
            }
        });
        setScore(newScore);
        setIsModalVisible(true);
    };


    const handleModalClose = () => {
        setIsModalVisible(false);
    };

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
                            onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                        />
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btn' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
                <div className='side-dashboard'>
                    <div className='tag'>Categories</div>
                    <div className='tagsList'>Cyber</div>
                    <div className='tag'>Score</div>
                    <div className='detail'>
                        <div>
                            <strong>Total Mcqs:</strong> <span>{questions.length}</span>
                        </div>
                        <div>
                            <strong>Attempts:</strong> <span>{userAnswers.length}</span>
                        </div>
                    </div>
                </div>
            </div>


            <Modal
                title="Quiz Result"
                visible={isModalVisible}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                footer={[
                    <button className='btn' style={{ minWidth: '85px', height: '35px' }} key="ok" type="primary" onClick={handleModalClose}>
                        OK
                    </button>,
                ]}
            >
                <p>Your Score: {score} / {questions.length}</p>
            </Modal>

            <Footer />
        </>
    );
}

export default IndexMcqs;
