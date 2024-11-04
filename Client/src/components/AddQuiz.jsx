import React, { useEffect, useState, useRef } from 'react';

// MUI | ANT-D :
import { Button, Input, Upload, Select, Table, Modal } from 'antd';

// Asserts | ICONS : 
import { LoadingOutlined } from '@ant-design/icons';
import { BsArrowLeftShort } from "react-icons/bs"
import { FaEye } from 'react-icons/fa';
import { MdOutlineSubtitles, MdEdit, MdDelete } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { LuFileQuestion } from "react-icons/lu";
import { AiOutlineSolution } from "react-icons/ai";
import { CgOptions } from "react-icons/cg";

// API's
import { CreatQuizAPI, UpdateQuizAPI } from '../Api/quiz';
import { GetAllCategoriesAPI, AddCategoryAPI } from '../Api/category';
// Helper :
import { toast } from 'react-hot-toast';
import ImgURLGEN from '../Utils/ImgUrlGen';

// Puzzle :
import Crossword, { ThemeProvider } from '@jaredreisinger/react-crossword';
// Editor :
import MonacoEditor from "@monaco-editor/react";


// CSS :
import './style/AddQuiz.scss';
import 'react-quill/dist/quill.snow.css';





// these functions is for image uploading 
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        return console.log('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        return console.log('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const PuzzleSampleCode = `{
    "across": {
      "1": { "clue": "Secure communication protocol for the web", "answer": "HTTPS", "row": 0, "col": 0 },
      "2": { "clue": "Unauthorized access to data", "answer": "HACKING", "row": 0, "col": 5 },
      "3": { "clue": "Malicious software", "answer": "SECURITY", "row": 2, "col": 0 },
      "7": { "clue": "Malicious software", "answer": "RANSOMWARE", "row": 3, "col": 5 }
    },
    "down": {
      "1": { "clue": "Technique for disguising digital data", "answer": "HASH", "row": 0, "col": 0 },
      "4": { "clue": "Virus", "answer": "ATTACK", "row": 0, "col": 6 },
      "5": { "clue": "Virus", "answer": "TROGEN", "row": 1, "col": 4 },
      "6": { "clue": "Virus", "answer": "VIRUS", "row": 1, "col": 5 }
    }
}`
const QuizTypes = [{ value: "mcq", label: "MCQ" }, { value: "flash", label: "Flash Cards" }, { value: "puzzle", label: "Puzzle" }, { value: "true", label: "True / False" }, { value: "open", label: "Open Question Answer" }]
export default function AddCourse({ allQuizes, selectedQuiz, closeSubPage }) {

    const crosswordRef = useRef();

    const [allCategories, setAllCategories] = useState(null)

    const [newCategories, setNewCategories] = useState([])

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formthumbUploadError, setFormthumbUploadError] = useState({});


    const [formData, setFormData] = useState({
        title: "",
        image: null,
        quote: "",
        slug: "",
        type: "mcq",
        categories: [],
    })
    const [questions, setQuestions] = useState([])
    const [puzzleCode, setPuzzleCode] = useState(PuzzleSampleCode)
    const [formError, setFormError] = useState({
        title: null,
        quote: null,
        slug: null,
    })

    const [imageUrl, setImageUrl] = useState(null)
    const [file, setFile] = useState(null)

    const [questionData, setQuestionData] = useState({
        question: "",
        answer: "",
        options: []
    })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPuzzleSampleModalVisible, setIsPuzzleSampleModalVisible] = useState(false);

    const [loading, setLoading] = useState(false)


    const enterFormData = (event) => {
        let { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        })
        setFormErrors({
            ...formErrors,
            [name]: value ? "" : "This field is required",
        });
    };

    const handleCategoryChange = (event) => {
        let newCategoryList = event.filter(cat => !allCategories.some(v => cat == v?._id))
        let selectedCategoryList = allCategories?.map(cat => cat?._id)?.filter(cat => event.includes(cat))
        setNewCategories(newCategoryList)
        setFormData({
            ...formData,
            categories: selectedCategoryList
        })
    }
    const handleEyeClick = (e) => {
        e.preventDefault();
        // window.open(URL.createObjectURL(file))
        // console.log(formData?.image);
        if (!formData?.image) {
            window.open(URL.createObjectURL(file))
        }
        else {
            window.open(formData?.image?.Location)
        }

    };
    const filterOptions = (inputValue, option) => {
        return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    };


    const handleUploadChange = (info) => {
        getBase64(info.file.originFileObj, (url) => {
            setImageUrl(url);
        });
        setFile(info?.file?.originFileObj || null)
        setFormthumbUploadError({});
    };

    const uploadButton = (
        <div>
            {loading && <LoadingOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );


    const gettingAllCategories = async () => {
        setCategoryLoading(true);
        let res = await GetAllCategoriesAPI();
        if (res.error != null) {
            toast.error(res?.error);
        } else {
            setAllCategories(res?.data?.result || [])
        }
        setCategoryLoading(false)
    }
    const validateForm = () => {
        const errors = {};
        const requiredFields = ["title", "quote", "type", "slug"];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = "This field is required";
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }


    useEffect(() => {
        if (selectedQuiz) {
            setFormData({
                title: selectedQuiz?.title,
                quote: selectedQuiz?.quote,
                slug: selectedQuiz?.slug,
                type: selectedQuiz?.type,
                categories: selectedQuiz?.categories.map(cat => cat?._id) || [],
                // image: selectedQuiz?.image
            })
            setQuestions(selectedQuiz?.questions)
            setImageUrl(ImgURLGEN(selectedQuiz?.image))
        } else {
            setFormData({
                title: "",
                quote: "",
                slug: "",
                type: "mcq",
                categories: [],
            })
            setImageUrl()
        }
    }, [selectedQuiz])
    useEffect(() => {
        gettingAllCategories()
    }, [])

    const handleUploadBlog = async () => {

        if (!imageUrl) {
            setFormthumbUploadError({ file: 'Please upload an image.' });
            return;
        }
        if (!validateForm()) {
            toast.error("Some fields are Missing");

            return;
        }
        if (formData?.type == "puzzle") {
            try {
                let x = JSON.parse(puzzleCode)
            } catch (err) {
                toast.error("Puzzle Code JSON format is Invalid, please correct Format")
                return
            }
        }
        setLoading(true)

        let allCategoriesList = formData.categories;

        if (newCategories && newCategories.length >= 1) {
            let categoryRes = await AddCategoryAPI(newCategories)
            if (categoryRes.error != null) return toast.error(categoryRes?.error)
            allCategoriesList = [...allCategoriesList, ...categoryRes?.data?.result.map(cat => cat?._id)]
        }

        let fData = new FormData()
        Object.keys(formData).map((key) => {
            if (formData[key] && !(key == "categories" || key == "tags")) {
                fData.append(key, formData[key])
            }

        })
        if (allCategoriesList.length >= 1) {
            allCategoriesList.map(val => {
                if (val && val != "" && val != " ") {
                    fData.append("categories", val)
                }
            })
        }

        if (questions && questions?.length >= 1) {
            fData.append("questions", JSON.stringify(questions))
        }

        if (file) {
            fData.append("file", file)
        }
        if (formData?.type == "puzzle") {
            fData.append("puzzleData", puzzleCode)
        }
        let res;
        if (selectedQuiz) {
            res = await UpdateQuizAPI(selectedQuiz?._id, fData)
        } else {
            res = await CreatQuizAPI(fData)
        }
        if (res.error != null) {
            toast.error(res.error)
        } else {
            toast.success(res?.data?.message)
            closeSubPage()
        }
        setLoading(false)
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


    const handleOpenPuzzleSampleModal = () => {
        if (crosswordRef.current) {
            crosswordRef.current.fillAllAnswers()
        }
        setIsPuzzleSampleModalVisible(true)
    }
    const showPuzzleResult = () => {
        if (crosswordRef.current) {
            crosswordRef.current.fillAllAnswers()
        }
    }
    const handleEditorChange = (value) => {
        setPuzzleCode(value);
    };
    const handleClosePuzzleSampleModal = () => {
        setIsPuzzleSampleModalVisible(false);
    };

    return (
        <>
            <div className="AddQuizFormContainer">
                <div className="headingAddQuiz">


                    <div className="heading"><BsArrowLeftShort className='icon' onClick={closeSubPage} /> <h2>Add Quiz</h2></div>


                </div>
                <div className="AddQuizBodyArea">
                    <>
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleUploadChange}
                        >
                            {imageUrl ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="imgBox" style={{ flex: '1 1 auto' }}>
                                        <img
                                            src={imageUrl}
                                            alt="avatar"
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    </div>
                                    <FaEye
                                        onClick={handleEyeClick}
                                        style={{
                                            fontSize: '24px',
                                            cursor: 'pointer',
                                            color: '#000',
                                        }}
                                    />
                                </div>
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                        {formthumbUploadError?.file && <div className="errorMessage">{formthumbUploadError?.file}</div>}

                    </>
                    <div className="InputFields">
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Quiz Title</div>
                                <Input prefix={<MdOutlineSubtitles />} size='large' className='blogInput' type="text" placeholder='Quiz Title' name="title" onChange={enterFormData} value={formData?.title} />
                                {formErrors.title && <div className="errorMessage">{formErrors.title}</div>}
                            </div>
                            <div className="field2 field">
                                <div className="lableName">Quiz Slug</div>
                                <Input prefix={<MdOutlineSubtitles />} size='large' className='blogInput' type="text" placeholder='Quiz slug' name="slug" onChange={enterFormData} value={formData?.slug} />
                                {formErrors.slug && <div className="errorMessage">{formErrors.slug}</div>}
                            </div>

                        </div>
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Quiz Quote</div>
                                <Input prefix={<FaQuoteLeft />} size='large' className='blogInput' type="text" placeholder='Quiz Quote' name="quote" onChange={enterFormData} value={formData?.quote} />
                                {formErrors.quote && <div className="errorMessage">{formErrors.quote}</div>}
                            </div>
                        </div>
                        <div className="Inputfield">
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
                            <div className="field2 field" id='category'>
                                <div className="lableName">Category</div>
                                <div className="inputselect">
                                    <div className="selecticon"><BiCategoryAlt size={24} className='iconInfo' /></div>
                                    <Select
                                        mode='tags'
                                        placeholder='Select Category'
                                        variant={"borderless"}
                                        className='selector'
                                        value={[...formData.categories, ...newCategories]}
                                        onChange={handleCategoryChange}
                                        getPopupContainer={() => document.getElementById('category')}

                                        loading={categoryLoading}
                                        options={allCategories && allCategories?.map(cat => ({ value: cat?._id, label: cat?.name }))}
                                        filterOption={filterOptions}
                                    />
                                </div>

                            </div>
                        </div>
                        {
                            formData?.type == "puzzle" ?
                                <>
                                    <div className="field2 field descriptionMain">
                                        <div className="flex descriptionHeader heading">
                                            <h3> Fill Puzzle Data </h3>
                                            <Button className="btn" onClick={handleOpenPuzzleSampleModal}>Show Sample</Button>
                                        </div>
                                        <div style={{ padding: "1rem" }} className="descriptionPara editorBox">
                                            <MonacoEditor
                                                height="300px"
                                                language="json"
                                                value={puzzleCode}
                                                onChange={handleEditorChange}
                                                options={{
                                                    formatOnType: true,
                                                    formatOnPaste: true,
                                                    automaticLayout: true,
                                                    minimap: { enabled: false },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                                :
                                <div className="field2 field descriptionMain">
                                    <div className="flex descriptionHeader heading">
                                        <h3> Questions List </h3>
                                        <Button className="btn" onClick={handleAddQuestionClick}>Add Question</Button>
                                    </div>
                                    <div className="descriptionPara">
                                        <Table dataSource={questions} columns={columns} rowKey="title" />
                                    </div>
                                </div>
                        }
                        {
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Button className="btn" style={{ width: "40px" }} onClick={handleUploadBlog} loading={loading}>
                                    {selectedQuiz ? "Update" : "Save"}
                                </Button>
                            </div>
                        }

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
            <Modal
                width={"750px"}
                title="Puzzle Data Sample"
                visible={isPuzzleSampleModalVisible}
                onCancel={handleClosePuzzleSampleModal}
                footer={null}  // You can add buttons if needed
            >
                <div className="puzzleSampleModalBox">
                    <div className="editorBox">
                        <MonacoEditor
                            height="300px"
                            language="json"
                            value={PuzzleSampleCode}
                            options={{
                                formatOnType: true,  // Auto-format while typing
                                formatOnPaste: true, // Auto-format when pasting JSON
                                automaticLayout: true,
                                minimap: { enabled: false },
                            }}
                        />
                    </div>
                    <div className="puzzle">
                        <ThemeProvider theme={{}}>
                            <Crossword data={JSON.parse(PuzzleSampleCode)} useStorage={false} ref={crosswordRef} />
                        </ThemeProvider>
                        <Button className='btn' style={{ margin: "auto" }} onClick={showPuzzleResult}>Show result</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
