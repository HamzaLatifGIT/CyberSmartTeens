import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "antd";

// Components :
import Navbar from "../Navbar";
import Footer from "../Footer";
import MCQQuestion from "./MCQs";
import SubjectiveQuestion from "./Subjectives";
import { attemptQuiz } from "../../Api/quiz";
import toast from "react-hot-toast";

function IndexMcqs() {
    let location = useLocation();
    let quizData = location?.state;

    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [selectedData, setSelectedData] = useState(
        questions.map((q) => ({
            attempt: null,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
        }))
    );

    const [loading, setLoading] = useState(false)

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

    const handleAnswerChange = (
        index,
        option,
        question,
        options,
        correctAnswer
    ) => {
        const updatedData = [...selectedData];
        updatedData[index] = { attempt: option, question, options, correctAnswer };
        setSelectedData(updatedData);
    };

    const handleSubmit = async () => {
        let newCorrect = 0;
        let newWrong = 0;
        selectedData.forEach((q, index) => {
            if (q.attempt === q.correctAnswer) {
                newCorrect += 1;
            } else {
                newWrong += 1;
            }
        });

        setCorrect(newCorrect);
        setWrong(newWrong);
        setIsModalVisible(true);

        const params = {
            correct: newCorrect,
            wrong: newWrong,
            quizData: quizData?._id,
            attempts: selectedData,
        };

        const res = await attemptQuiz(params);
        if (res.error != null) {
            toast.error(res.error);
        } else {
            toast.success(res.message);
        }
    };
    const handleSubmitOpenQuestions = async () => {
        setLoading(true)
        const params = {
            correct: 0,
            wrong: 0,
            quizData: quizData?._id,
            attempts: selectedData,
        };
        const res = await attemptQuiz(params);
        if (res.error != null) {
            toast.error(res.error);
        } else {
            toast.success("Quiz Submitted Success");
        }
        setLoading(false)
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Navbar />
            <div className="McqDetail">
                <div className="McqContainer">
                    <h1 style={{ display: "flex", justifyContent: "center" }}>
                        Cyber Security {quizData.type == "mcq" ? "MCQs" : quizData.type == "open" ? "Subjective" : "True / False"}
                    </h1>
                    {questions.map((q, index) => (
                        quizData.type == "open" ?
                            <SubjectiveQuestion
                                key={index}
                                number={index}
                                question={q.question}
                                options={q.options}
                                correctAnswer={q.correctAnswer}
                                selectedData={selectedData[index]}
                                onAnswerChange={(option) =>
                                    handleAnswerChange(index, option, q.question, q.options, q.correctAnswer)
                                }
                            />
                            :
                            <MCQQuestion
                                key={index}
                                question={q.question}
                                options={quizData.type === 'mcq' ? q.options : ['true', 'false']}
                                correctAnswer={q.correctAnswer}
                                selectedData={selectedData[index]}
                                onAnswerChange={(option) =>
                                    handleAnswerChange(index, option, q.question, q.options, q.correctAnswer)
                                }
                            />
                    ))}

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="btn" onClick={quizData?.type == "open" ? handleSubmitOpenQuestions : handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
                <div className="side-dashboard">
                    <div className="tags">Categories</div>
                    <div className="tagsList">
                        <div className="tagsList">
                            {
                                quizData?.categories?.map((cat, index) => <div key={index} className="tag">{cat?.name}</div>)
                            }
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
                    <button
                        className="btn"
                        style={{ minWidth: "85px", height: "35px" }}
                        key="ok"
                        type="primary"
                        onClick={handleModalClose}
                    >
                        OK
                    </button>,
                ]}
            >
                <p>
                    Your Score: {correct} / {questions.length}
                </p>
                <p>
                    Wrong Answers: {wrong} / {questions.length}
                </p>
            </Modal>

            <Footer />
        </>
    );
}

export default IndexMcqs;
