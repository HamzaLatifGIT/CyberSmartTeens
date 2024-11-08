import React, { useEffect, useState } from 'react';

// MUI | ANT-D :
import { Button, Input, Upload, Select, Table, Modal } from 'antd';

// Asserts | ICONS : 
import { LoadingOutlined } from '@ant-design/icons';
import { BsArrowLeftShort } from "react-icons/bs"
import { FaEye } from 'react-icons/fa';
import { MdDelete, MdEdit, MdOutlineSubtitles } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { IoFlash } from "react-icons/io5";


// API's
import { CreatCoursesAPI, UpdateCourseAPI } from '../Api/course';
import { GetAllCategoriesAPI, AddCategoryAPI } from '../Api/category';
import { GetAllQuizesAPI } from '../Api/quiz';
import { GetAllFlashCardsAPI } from '../Api/flashcard';
// Helper :
import { toast } from 'react-hot-toast';
import ImgURLGEN from '../Utils/ImgUrlGen';
import ReactQuill from 'react-quill';

// CSS :
import './style/AddCourse.scss';

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

export default function AddCourse({ allBlogs, selectedCourse, closeSubPage }) {

    const [allCategories, setAllCategories] = useState(null)

    const [newCategories, setNewCategories] = useState([])

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formthumbUploadError, setFormthumbUploadError] = useState({});


    const [formData, setFormData] = useState({
        title: "",
        detail: "",
        image: null,
        quote: "",
        slug: "",
        quiz: null,
        flashCard: null,
        categories: [],
    })
    const [quizzes, setQuizzes] = useState([])
    const [flashCards, setFlashCards] = useState([])

    const [lesson, setLesson] = useState("")
    const [lessons, setLessons] = useState([])
    const [LessonModalStatus, setLessonModalStatus] = useState({
        open: false,
        edited: false,
        index: null
    })

    const [imageUrl, setImageUrl] = useState(null)
    const [file, setFile] = useState(null)

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


    const handleAddLessonClick = (index = null) => {
        if (index != null) {
            setLessonModalStatus({
                open: true,
                edited: true,
                index
            })
            setLesson(lessons[index])
        } else {
            setLessonModalStatus({
                open: true,
                edited: false,
                index: null
            })
            setLesson("")
        }
    }
    const handleDeleteLesson = (index) => {
        setLessons(lessons.filter((data, i) => i != index))
    }
    const handleCloseModal = () => {
        setLessonModalStatus({
            open: false,
            edited: false,
            index: null
        })
        setLesson("")
    }
    const handleAddLesson = () => {
        if (LessonModalStatus.edited) {
            let UpdatedLessons = lessons.map((l, i) => {
                if (i == LessonModalStatus.index) {
                    return lesson
                } else {
                    return l
                }
            })
            setLessons(UpdatedLessons)
        } else {
            setLessons([
                ...lessons,
                lesson
            ])
        }
        setLessonModalStatus({
            open: false,
            edited: false,
            index: null
        })
        setLesson("")
    }


    const validateForm = () => {
        const errors = {};
        const requiredFields = ["title", "quote", "slug"];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = "This field is required";
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }


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
    const fetchQuizzes = async () => {
        const result = await GetAllQuizesAPI();
        if (result.error) {
            toast.error(result.error);
        } else {
            let quizzes = result.data.result;
            setQuizzes(quizzes || []);
        }
    };
    const fetchFlashCards = async () => {
        const result = await GetAllFlashCardsAPI();
        if (result.error) {
            toast.error(result.error);
        } else {
            setFlashCards(result?.data?.result || []);
        }
    };


    useEffect(() => {
        if (selectedCourse) {
            setFormData({
                title: selectedCourse?.title,
                quote: selectedCourse?.quote,
                detail: selectedCourse?.detail,
                slug: selectedCourse?.slug,
                quiz: selectedCourse?.quiz?._id,
                flashCard: selectedCourse?.flashCard?._id,
                categories: selectedCourse?.categories.map(cat => cat?._id) || [],
                // image: selectedCourse?.image
            })
            setLessons(selectedCourse?.lessons || [])
            setImageUrl(ImgURLGEN(selectedCourse?.image))
        } else {
            setFormData({
                title: "",
                quote: "",
                detail: "",
                slug: "",
                quiz: null,
                flashCard: null,
                categories: [],
            })
            setLessons([])
            setImageUrl()
        }
    }, [selectedCourse])
    useEffect(() => {
        gettingAllCategories()
        fetchQuizzes();
        fetchFlashCards();
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

        if (lessons && lessons.length >= 1) {
            fData.append("lessons", JSON.stringify(lessons))
        }

        if (file) {
            fData.append("file", file)
        }
        let res;
        if (selectedCourse) {
            res = await UpdateCourseAPI(selectedCourse?._id, fData)
        } else {
            res = await CreatCoursesAPI(fData)
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
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Lesson Detail',
            key: 'answer',
            render: (_, l) => <p dangerouslySetInnerHTML={{ __html: l.slice(0, 70) }} />
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record, index) => (
                <span>
                    <Button
                        type="primary"
                        icon={<MdEdit />}
                        onClick={() => handleAddLessonClick(index)}
                    >
                    </Button>
                    <Button
                        type="danger"
                        icon={<MdDelete />}
                        onClick={() => handleDeleteLesson(index)}
                    >
                        {/* Delete */}
                    </Button>
                </span>
            ),
        },
    ];

    var toolbarOptions = [
        ['bold', 'italic'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],
        ['image', 'video'],                      // text direction

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

    ];
    var toolbarOptionsMobile = [
        ['bold', 'italic'],
        [{ 'font': [] }],
        ['image'],
    ];

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
        'code-block',
        'align',
        'direction',
        'color',
        'background',
        'script',
        'super',
        'sub',
    ];

    const modules = {
        toolbar: toolbarOptions
    };
    const modulesMobile = {
        toolbar: toolbarOptionsMobile
    };

    return (
        <>
            <div className="AddBlogFormContainer">
                <div className="headingAddQuiz">
                    <div className="heading"><BsArrowLeftShort className='icon' onClick={closeSubPage} /> <h2>Add Course</h2></div>
                </div>
                <div className="AddBlogBodyArea">
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
                                <div className="lableName">Course Title</div>
                                <Input prefix={<MdOutlineSubtitles />} size='large' className='blogInput' type="text" placeholder='Course Title' name="title" onChange={enterFormData} value={formData?.title} />
                                {formErrors.title && <div className="errorMessage">{formErrors.title}</div>}
                            </div>
                            <div className="field2 field">
                                <div className="lableName">Course Slug</div>
                                <Input prefix={<MdOutlineSubtitles />} size='large' className='blogInput' type="text" placeholder='Course slug' name="slug" onChange={enterFormData} value={formData?.slug} />
                                {formErrors.slug && <div className="errorMessage">{formErrors.slug}</div>}
                            </div>

                        </div>
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Course Quote</div>
                                <Input prefix={<FaQuoteLeft />} size='large' className='blogInput' type="text" placeholder='Course Quote' name="quote" onChange={enterFormData} value={formData?.quote} />
                                {formErrors.quote && <div className="errorMessage">{formErrors.quote}</div>}
                            </div>
                            <div className="field1 field" id='category'>
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
                        <div className="Inputfield">
                            <div className="field1 field" id='category'>
                                <div className="lableName">Quiz</div>
                                <div className="inputselect">
                                    <div className="selecticon"><BiCategoryAlt size={24} className='iconInfo' /></div>
                                    <Select
                                        showSearch
                                        value={formData.quiz}
                                        placeholder="Select Quiz"
                                        variant={"borderless"}
                                        className='selector'
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(v) => enterFormData({ target: { name: "quiz", value: v } })}
                                        options={quizzes && quizzes?.map(quiz => ({ value: quiz?._id, label: quiz?.title }))}
                                    />
                                </div>
                            </div>
                            <div className="field1 field" id='category'>
                                <div className="lableName">FlashCard</div>
                                <div className="inputselect">
                                    <div className="selecticon"><IoFlash size={24} className='iconInfo' /></div>
                                    <Select
                                        showSearch
                                        value={formData.flashCard}
                                        placeholder="Select FlashCard"
                                        variant={"borderless"}
                                        className='selector'
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(v) => enterFormData({ target: { name: "flashCard", value: v } })}
                                        options={flashCards && flashCards?.map(flash => ({ value: flash?._id, label: flash?.title }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="field2 field descriptionMain">
                            <div className="flex descriptionHeader heading">
                                <h3> Lessons List </h3>
                                <Button className="btn" onClick={() => handleAddLessonClick(null)}>Add Lesson</Button>
                            </div>
                            <div className="descriptionPara">
                                <Table dataSource={lessons} columns={columns} rowKey={(record, index) => index} />
                            </div>
                        </div>
                        {
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Button className="btn" style={{ width: "40px" }} onClick={handleUploadBlog} loading={loading}>
                                    {selectedCourse ? "Update" : "Save"}
                                </Button>
                            </div>
                        }

                    </div>
                </div>
            </div>
            <Modal
                width={"85%"}
                title="Lesson Details"
                visible={LessonModalStatus.open}
                onCancel={handleCloseModal}
                footer={null}  // You can add buttons if needed
            >
                <div className='QuizModal'>
                    <div className="InputFields">
                        <div className="descriptionPara">
                            <ReactQuill theme='snow' formats={formats} modules={modules} style={{ height: "250px" }} className='contentPara' value={lesson} name="detail" onChange={(val) => setLesson(val)} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Button className="btn" style={{ width: "40px" }} onClick={handleAddLesson}>
                                {LessonModalStatus?.edited ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
