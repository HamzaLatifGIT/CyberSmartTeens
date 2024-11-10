import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "antd";

// Components :
import MCQQuestion from "./MCQs";
import SubjectiveQuestion from "./Subjectives";
import { attemptQuiz, SubjectiveQuizAttemptAPI } from "../../Api/quiz";
import toast from "react-hot-toast";

function IndexMcqs({ data, SaveScore, clicked }) {
    let location = useLocation();
    let quizData = data;

    const [submited, setSubmited] = useState(false)
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
        // setIsModalVisible(true);

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
            // toast.success(res.message);
            setSubmited(true)
            SaveScore({ [quizData._id]: newCorrect })
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
        const res = await SubjectiveQuizAttemptAPI(params);
        if (res.error != null) {
            toast.error(res.error);
        } else {
            toast.success("Quiz Submitted Success");
            setTimeout(() => {
                window.location.href = "/"
            }, 2500);
        }
        setLoading(false)
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (clicked == true) {
            if (!submited) {
                if (quizData?.type == "open") {
                    handleSubmitOpenQuestions()
                } else {
                    handleSubmit()
                }
            }
        }
    }, [clicked])

    return (
        <>
            <div className="McqDetail">
                <div className="McqContainer">
                    <h1 style={{ display: "flex", justifyContent: "center" }}>
                        {/* Cyber Security {quizData.type == "mcq" ? "MCQs" : quizData.type == "open" ? "Subjective" : "True / False"} */}
                        {quizData?.title}
                    </h1>
                    {questions.map((q, index) => (
                        quizData.type == "open" ?
                            <SubjectiveQuestion
                                submited={submited}
                                key={index}
                                number={index}
                                question={q.question}
                                options={q.options}
                                correctAnswer={q.correctAnswer}
                                selectedData={selectedData[index]}
                                onAnswerChange={(option) => !submited &&
                                    handleAnswerChange(index, option, q.question, q.options, q.correctAnswer)
                                }
                            />
                            :
                            <MCQQuestion
                                submited={submited}
                                key={index}
                                question={q.question}
                                options={quizData.type === 'mcq' ? q.options : ['true', 'false']}
                                correctAnswer={q.correctAnswer}
                                selectedData={selectedData[index]}
                                onAnswerChange={(option) => !submited &&
                                    handleAnswerChange(index, option, q.question, q.options, q.correctAnswer)
                                }
                            />
                    ))}

                    {/* <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button style={submited ? { cursor: "no-drop" } : {}} className="attemptBtn" onClick={quizData?.type == "open" ? handleSubmitOpenQuestions : handleSubmit}>
                            {submited ? "Submited" : "Submit"}
                        </Button>
                    </div> */}
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
        </>
    );
}

export default IndexMcqs;
