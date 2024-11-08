import React, { useEffect, useState, useRef } from 'react';

// MUI | ANT-D :
import { Button, Input, Select, Table, Modal } from 'antd';

// Asserts | ICONS : 
import { BsArrowLeftShort } from "react-icons/bs"
import { MdOutlineSubtitles, MdEdit, MdDelete } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { LuFileQuestion } from "react-icons/lu";
import { AiOutlineSolution } from "react-icons/ai";
import { CgOptions } from "react-icons/cg";

// API's
import { CreatQuizAPI, UpdateQuizAPI } from '../Api/quiz';
// Helper :
import { toast } from 'react-hot-toast';

// CSS :
import './style/AddQuiz.scss';
import 'react-quill/dist/quill.snow.css';




const QuizTypes = [{ value: "mcq", label: "MCQ" }, { value: "true", label: "True / False" }, { value: "open", label: "Open Question Answer" }]
export default function AddCourseType({ selectedQuizType, closeSubPage, SaveQuizType }) {

    const [formData, setFormData] = useState({
        title: "",
        type: "mcq",
    })
    const [questions, setQuestions] = useState([])
    const [questionData, setQuestionData] = useState({
        question: "",
        answer: "",
        options: []
    })
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [loading, setLoading] = useState(false)


    const enterFormData = (event) => {
        let { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        })
    };


    const filterOptions = (inputValue, option) => {
        return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    };


    const validateForm = () => {
        const errors = {};
        const requiredFields = ["title", "quote", "type", "slug"];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = "This field is required";
            }
        });
        return Object.keys(errors).length === 0;
    }


    useEffect(() => {
        if (selectedQuizType) {
            setFormData({
                title: selectedQuizType?.title,
                type: selectedQuizType?.type,
            })
            setQuestions(selectedQuizType?.questions)
        } else {
            setFormData({
                title: "",
                type: "mcq",
            })
        }
    }, [selectedQuizType])

    const HandleSaveQuizType = async () => {
        let Payload = {
            title: formData.title,
            type: formData.type,
            questions
        }
        SaveQuizType(Payload)
    }

    const columns = [
        {
            title: 'Question Title',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        ...(
            formData?.type == "mcq" ?
                [{
                    title: 'Options',
                    dataIndex: 'options',
                    key: 'options',
                }]
                : []
        ),
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record, index) => (
                <span>
                    <Button
                        type="primary"
                        icon={<MdEdit />}
                        onClick={() => handleAddQuestionClick(record, index)} // Show modal with course details
                    //   style={{ marginRight: 8, backgroundColor: 'rgb(71 250 198 / 26%)' }}
                    >
                    </Button>
                    <Button
                        type="danger"
                        icon={<MdDelete />}
                        onClick={() => handleDeleteQuestion(index)} // Assuming record._id holds unique ID
                    >
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    const handleAddQuestionClick = (record, index) => {
        if (record && record?.question) {
            setQuestionData({
                ...record,
                edited: true,
                id: index
            })
        } else {
            setQuestionData({
                question: "",
                answer: "",
                options: []
            })
        }
        setIsModalVisible(true);
    }
    const handleDeleteQuestion = (id) => {
        let UpdatedQuestions = questions.filter((data, index) => index != id)
        setQuestions(UpdatedQuestions)
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const enterQuestionData = (event) => {
        let { name, value } = event.target;

        setQuestionData({
            ...questionData,
            [name]: value
        })
    };
    const handleAddQuestion = () => {
        if (questionData?.edited) {
            let EditedQuestions = questions.map((data, index) => {
                if (questionData?.id == index) {
                    return {
                        question: questionData?.question,
                        answer: questionData?.answer,
                        options: questionData?.options
                    }
                } else {
                    return data
                }
            })
            setQuestions(EditedQuestions)
        } else {
            let NewQuestionData = {
                question: questionData?.question,
                answer: questionData?.answer,
                options: questionData?.options
            }
            setQuestions([...questions, NewQuestionData])
        }
        setQuestionData({
            question: "",
            answer: "",
            options: []
        })
        setIsModalVisible(false)
    }

    return (
        <>
            <div className="AddQuizFormContainer">
                <div className="headingAddQuiz">
                    <div className="heading"><BsArrowLeftShort className='icon' onClick={closeSubPage} /> <h2>Add Quiz Type</h2></div>
                </div>
                <div className="AddQuizBodyArea">
                    <div className="InputFields">
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Quiz Title</div>
                                <Input prefix={<MdOutlineSubtitles />} size='large' className='blogInput' type="text" placeholder='Quiz Title' name="title" onChange={enterFormData} value={formData?.title} />
                            </div>
                            <div className="field1 field" id='quiztype'>
                                <div className="lableName">Type</div>
                                <div className="inputselect">
                                    <div className="selecticon"><BiCategoryAlt size={24} className='iconInfo' /></div>
                                    <Select
                                        placeholder='Select Type'
                                        variant={"borderless"}
                                        className='selector'
                                        value={formData?.type}
                                        onChange={(e) => enterFormData({ target: { name: "type", value: e } })}
                                        getPopupContainer={() => document.getElementById('quiztype')}
                                        options={QuizTypes}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field2 field descriptionMain">
                            <div className="flex descriptionHeader heading">
                                <h3> Questions List </h3>
                                <Button className="btn" onClick={handleAddQuestionClick}>Add Question</Button>
                            </div>
                            <div className="descriptionPara">
                                <Table dataSource={questions} columns={columns} rowKey="title" />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Button className="btn" style={{ width: "40px" }} onClick={HandleSaveQuizType} loading={loading}>
                                {selectedQuizType ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Question Details"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}  // You can add buttons if needed
            >
                <div className='QuizModal'>
                    <div className="InputFields">
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Question</div>
                                <Input prefix={<LuFileQuestion />} size='large' className='blogInput' type="text" placeholder='Question Title' name="question" onChange={enterQuestionData} value={questionData?.question} />
                            </div>
                        </div>
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Answer</div>
                                {
                                    formData.type == "true" ?
                                        <>
                                            <div className="inputselect">
                                                <div className="selecticon"><AiOutlineSolution size={24} className='iconInfo' /></div>
                                                <Select
                                                    placeholder='True or False'
                                                    variant={"borderless"}
                                                    className='selector'
                                                    value={questionData?.answer || null}
                                                    onChange={(e) => enterQuestionData({ target: { name: "answer", value: e } })}
                                                    getPopupContainer={() => document.getElementById('quiztype')}
                                                    options={[{ value: "true", label: "True" }, { value: "false", label: "False" }]}
                                                />
                                            </div>
                                        </>
                                        :
                                        <Input prefix={<AiOutlineSolution />} size='large' className='blogInput' type="text" placeholder='Answer' name="answer" onChange={enterQuestionData} value={questionData?.answer} />
                                }
                            </div>
                        </div>
                        {
                            formData?.type == "mcq" &&
                            <div className="Inputfield">
                                <div className="field2 field" id='optionselect'>
                                    <div className="lableName">Options</div>
                                    <div className="inputselect">
                                        <div className="selecticon"><CgOptions size={24} className='iconInfo' /></div>
                                        <Select
                                            mode='tags'
                                            placeholder='Add Options'
                                            variant={"borderless"}
                                            className='selector'
                                            value={questionData?.options}
                                            onChange={(e) => enterQuestionData({ target: { name: "options", value: e } })}
                                            getPopupContainer={() => document.getElementById('optionselect')}

                                            options={questionData && questionData?.options?.map(op => ({ value: op, label: op }))}
                                            filterOption={filterOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Button className="btn" style={{ width: "40px" }} onClick={handleAddQuestion} loading={loading}>
                                {questionData?.edited ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
