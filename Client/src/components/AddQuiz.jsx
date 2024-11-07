import React, { useEffect, useState } from 'react';

// MUI | ANT-D :
import { Button, Input, Upload, Select, Table, Modal } from 'antd';

// Asserts | ICONS : 
import { LoadingOutlined } from '@ant-design/icons';
import { BsArrowLeftShort } from "react-icons/bs"
import { FaEye } from 'react-icons/fa';
import { MdOutlineSubtitles, MdEdit, MdDelete } from "react-icons/md";
import { FaQuoteLeft } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";

// Component :
import AddCourseType from './AddQuizType';

// API's
import { CreatQuizAPI, UpdateQuizAPI } from '../Api/quiz';
import { GetAllCategoriesAPI, AddCategoryAPI } from '../Api/category';
// Helper :
import { toast } from 'react-hot-toast';
import ImgURLGEN from '../Utils/ImgUrlGen';

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
export default function AddCourse({ allQuizes, selectedQuiz, closeSubPage }) {

    const [allCategories, setAllCategories] = useState(null)

    const [newCategories, setNewCategories] = useState([])

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formthumbUploadError, setFormthumbUploadError] = useState({});

    const [currentPage, setCurrentPage] = useState("main")
    const [formData, setFormData] = useState({
        title: "",
        image: null,
        quote: "",
        slug: "",
        categories: [],
    })
    const [imageUrl, setImageUrl] = useState(null)
    const [file, setFile] = useState(null)

    const [quizzes, setQuizzes] = useState([])
    const [selectedQuizTypeData, setSelectedQuizTypeData] = useState({
        data: null,
        edited: false,
        id: null
    })

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
        const requiredFields = ["title", "quote", "slug"];
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
                categories: selectedQuiz?.categories.map(cat => cat?._id) || [],
            })
            setQuizzes(selectedQuiz?.quizzes)
            setImageUrl(ImgURLGEN(selectedQuiz?.image))
        } else {
            setFormData({
                title: "",
                quote: "",
                slug: "",
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

        if (quizzes && quizzes?.length >= 1) {
            fData.append("quizzes", JSON.stringify(quizzes))

            let AllTypes = quizzes.map(data => data?.type)
            AllTypes = Array.from(new Set(AllTypes))
            fData.append("types", JSON.stringify(AllTypes))
        }

        if (file) {
            fData.append("file", file)
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
            title: 'Quiz Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'No of Questions',
            dataIndex: 'questions',
            key: 'questions',
            render: (questions) => questions?.length || 0
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record, index) => (
                <span>
                    <Button
                        type="primary"
                        icon={<MdEdit />}
                        onClick={() => handleOpenAddQuizTypePage(record, index)}
                    >
                    </Button>
                    <Button
                        type="danger"
                        icon={<MdDelete />}
                        onClick={() => handleDeleteQuizType(index)}
                    >
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    const handleOpenAddQuizTypePage = (record, index) => {
        if (record && record?.title) {
            setSelectedQuizTypeData({
                data: record,
                edited: true,
                id: index
            })
        } else {
            setSelectedQuizTypeData({
                data: null,
                edited: false,
                id: null
            })
        }
        setCurrentPage("type");
    }
    const handleDeleteQuizType = (id) => {
        let UpdatedQuizzes = quizzes.filter((data, index) => index != id)
        setQuizzes(UpdatedQuizzes)
    }

    const handleAddQuizType = (NewQuiz) => {
        if (selectedQuizTypeData?.edited) {
            let EditedQuizType = quizzes.map((data, index) => {
                if (selectedQuizTypeData?.id == index) {
                    return NewQuiz
                } else {
                    return data
                }
            })
            setQuizzes(EditedQuizType)
        } else {
            setQuizzes([...quizzes, NewQuiz])
        }
        setSelectedQuizTypeData({
            data: null,
            edited: false,
            id: null
        })
        setCurrentPage("main")
    }
    const CloseTypePage = () => {
        setSelectedQuizTypeData({
            data: null,
            edited: false,
            id: null
        })
        setCurrentPage("main")
    }

    return (
        currentPage == "type" ?
            <AddCourseType closeSubPage={CloseTypePage} selectedQuizType={selectedQuizTypeData?.data || null} SaveQuizType={handleAddQuizType} />
            :
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
                            <div className="field2 field descriptionMain">
                                <div className="flex descriptionHeader heading">
                                    <h3> Quizzes List </h3>
                                    <Button className="btn" onClick={handleOpenAddQuizTypePage}>Add Quiz Type</Button>
                                </div>
                                <div className="descriptionPara">
                                    <Table dataSource={quizzes} columns={columns} rowKey="title" />
                                </div>
                            </div>
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
            </>
    )
}
