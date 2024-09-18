import React, { useEffect, useState } from 'react';

// MUI | ANT-D :
import { Button, Input, Upload, Select } from 'antd';

// Asserts | ICONS : 
import { LoadingOutlined } from '@ant-design/icons';
import { BsArrowLeftShort } from "react-icons/bs"
import { Book, DocumentUpload, DollarSquare, Subtitle, Category, Tag, Eye } from 'iconsax-react';

// API's
// import { CreatBooksAPI, UpdateBooksAPI } from 'API/books';
// import { GetAllCategoriesAPI, GetAllTagsAPI, AddCategoryAPI, AddTagAPI } from 'API/categoryTag';
// Helpers :
// import { toast } from 'react-toastify';
// import ImgURLGEN from 'Utils/ImgUrlGen';
import ReactQuill from 'react-quill';

// CSS :
import './style/AddQuiz.scss'
import { MdTopic } from 'react-icons/md';



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

export default function AddQuiz({ openPage, selectedBook, allBooks, closeSubPage }) {

    const [allCategories, setAllCategories] = useState(null)
    const [allTags, setAllTags] = useState(null)

    const [newCategories, setNewCategories] = useState([])
    const [newtags, setNewtags] = useState([])

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [tagLoading, setTagLoading] = useState(false);
    const [formUploadError, setFormUploadError] = useState({});

    const [formthumbUploadError, setFormthumbUploadError] = useState({});




    const [formData, setFormData] = useState({
        title: "",
        detail: "",
        publisher: "",
        price: "0",
        file: null,
        categories: [],
        tags: [],
    })
    const [formError, setFormError] = useState({
        title: null,
        detail: null,
        publisher: null,
        price: null,
    })

    const [imageUrl, setImageUrl] = useState(null)
    const [file, setFile] = useState(null)
    const [formErrors, setFormErrors] = useState({});


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

    const handleEyeClick = () => {
        if (!formData?.image) {
            window.open(URL.createObjectURL(file))
        }
        else {
            window.open(formData?.image?.Location)
        }
    };

    const handleCategoryChange = (event) => {
        let newCategoryList = event.filter(cat => !allCategories.some(v => cat == v?._id))
        let selectedCategoryList = allCategories?.map(cat => cat?._id)?.filter(cat => event.includes(cat))
        setNewCategories(newCategoryList)
        setFormData({
            ...formData,
            categories: selectedCategoryList
        })

        setFormErrors({
            ...formErrors,
            categories: selectedCategoryList.length > 0 ? "" : "This field is required",
        });

    }
    const handleTagChange = (event) => {
        let newTagList = event.filter(cat => !allTags.some(v => cat == v?._id))
        let selectedTagList = allTags?.map(cat => cat?._id)?.filter(cat => event.includes(cat))
        setNewtags(newTagList)
        setFormData({
            ...formData,
            tags: selectedTagList
        })
        setFormErrors({
            ...formErrors,
            tags: selectedTagList.length > 0 ? "" : "This field is required",
        });

    }

    const handleUploadChange = (info) => {
        getBase64(info.file.originFileObj, (url) => {
            setImageUrl(url);
        });
        setFormthumbUploadError({});
        setFile(info?.file?.originFileObj || null)
    };
    const handleFileUploadChange = (info) => {
        setFormData({
            ...formData,
            file: info?.file?.originFileObj || null
        })
        setFormError({});
    };


    const filterOptions = (inputValue, option) => {
        return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    };
    const filterOptionsfortags = (inputValue, option) => {
        return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    };

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
    const gettingAllTags = async () => {
        setTagLoading(true);
        let res = await GetAllTagsAPI();
        if (res.error != null) {
            toast.error(res?.error);
        } else {
            setAllTags(res?.data?.result || [])
        }
        setTagLoading(false)
    }

    const validateForm = () => {
        const errors = {};
        const requiredFields = ["title", "detail", "price", "publisher"];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = "This field is required";
            }
        });
        if (formData.categories.length === 0) {
            errors.categories = "This field is required";
        }
        if (formData.tags.length === 0) {
            errors.tags = "This field is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }


    useEffect(() => {
        if (selectedBook) {
            const findBook = allBooks?.find(val => val?._id == selectedBook?._id)
            if (findBook) {
                setFormData({
                    title: findBook?.title,
                    detail: findBook?.detail,
                    price: findBook?.price,
                    publisher: findBook?.publisher,
                    categories: findBook?.categories.map(cat => cat?._id) || [],
                    tags: findBook?.tags.map(tag => tag?._id) || [],
                    image: findBook?.image
                })
                setImageUrl(ImgURLGEN(findBook?.image))
            }
        } else {
            setFormData({
                title: "",
                price: "",
                detail: "",
                publisher: "",
                tags: [],
                categories: [],
                file: null
            })
            setImageUrl()
        }
    }, [selectedBook])
    useEffect(() => {
        gettingAllCategories()
        gettingAllTags()
    }, [])

    const uploadButton = (
        <div>
            {loading && <LoadingOutlined />}
            <div
                style={{
                    marginTop: 0,
                }}
            >
                Upload
            </div>
        </div>
    );


    const handleUploadBook = async () => {
        const errors = {};

        // if (!imageUrl) {
        //     setFormthumbUploadError({ file: 'Please upload an image.' });
        //     return;
        // }

        // // Validate file
        // if (!formData?.file) {
        //     errors.file = "Please upload a file.";
        // }

        // if (!validateForm()) {
        //     toast.error("Some fields are Missing");

        //     return;
        // }

        // // Check if there are any errors
        // if (Object.keys(errors).length > 0) {
        //     setFormUploadError(errors);
        //     return; // Stop form submission
        // }
        // setLoading(true)

        let allCategoriesList = formData.categories;
        let alltagsList = formData.tags;

        if (newCategories && newCategories.length >= 1) {
            let categoryRes = await AddCategoryAPI(newCategories)
            if (categoryRes.error != null) return toast.error(categoryRes?.error)
            allCategoriesList = [...allCategoriesList, ...categoryRes?.data?.result.map(cat => cat?._id)]
        }
        if (newtags && newtags.length >= 1) {
            let tagRes = await AddTagAPI(newtags)
            if (tagRes.error != null) return toast.error(tagRes?.error)
            alltagsList = [...alltagsList, ...tagRes?.data?.result.map(cat => cat?._id)]
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
        if (alltagsList.length >= 1) {
            alltagsList.map(val => {
                if (val && val != "" && val != " ") {
                    fData.append("tags", val)
                }
            })
        }

        if (file) {
            fData.append("cover", file)
        }
        let res;
        if (selectedBook) {
            fData.append("_method", "PATCH")
            res = await UpdateBooksAPI(selectedBook?._id, fData)
        } else {
            res = await CreatBooksAPI(fData)
        }
        if (res.error != null) {
            toast.error(res.error)
        } else {
            toast.success(res?.data?.message)
            closeSubPage()
        }
        setLoading(false)
    }

    const handlePreview = (e) => {
        e.preventDefault();
        window.open(URL.createObjectURL(formData?.file))
    }

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

    const modules = {
        toolbar: toolbarOptions
    };
    const modulesMobile = {
        toolbar: toolbarOptionsMobile
    };

    const { TextArea } = Input



    return (
        <>
            <div className="AddBookFormContainer">
                <div className="headingAddBook">
                    <div className="headerleft heading upper flexLine flex">
                        <div className="heading"><h2>Add Quiz</h2></div>
                    </div>

                </div>
                <div className="AddBookBodyArea">


                    <div className="InputFields">
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Quiz Title</div>
                                <Input prefix={<Subtitle />} size='large' className='bookInput' type="text" placeholder='Quiz Title' name="title" onChange={enterFormData} value={formData?.title} />
                                {formErrors?.title && <div className="errorMessage">{formErrors?.title}</div>}
                            </div>
                            <div className="field2 field">
                                <div className="lableName">Quiz Title</div>
                                <div className='uploadBtn'>

                                    <div className="icon"><Book style={{ color: "black" }} /> {formData?.file ? formData?.file?.name : "Upload Your File Here"}
                                    </div>
                                    {formData?.file && <div className="iconEye" onClick={handlePreview}><Eye size={26} color="#000" /></div>}
                                    <Upload
                                        name="file"
                                        className="upload"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={handleFileUploadChange}
                                    >
                                        {formData?.file ? (
                                            <DocumentUpload />
                                        ) : (
                                            <DocumentUpload />
                                        )}
                                    </Upload>

                                </div>
                                {formUploadError?.file && <div className="errorMessage">{formUploadError?.file}</div>}

                            </div>

                        </div>
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Quiz Publisher</div>
                                <Input prefix={<Book />} size='large' className='bookInput' type="text" placeholder='Quiz Publisher' name="publisher" onChange={enterFormData} value={formData?.publisher} />
                                {formErrors?.publisher && <div className="errorMessage">{formErrors?.publisher}</div>}
                            </div>
                            <div className="field2 field">
                                <div className="lableName">Quiz Topic</div>
                                <Input prefix={<Book />} size='large' className='bookInput' type="text" placeholder='Quiz Topic' name="price" onChange={enterFormData} defaultValue={0} value={formData?.price} />
                                {formErrors?.price && <div className="errorMessage">{formErrors?.price}</div>}
                            </div>
                        </div>
                        <div className="Inputfield">
                            <div className="field1 field " id='gender'>
                                <div className="lableName">Category</div>
                                <div className="inputselect">
                                    <div className="selecticon"><Category size={24} className='iconInfo' /></div>
                                    <Select
                                        mode='multiple'
                                        placeholder='Select Category'
                                        value={[...formData.categories, ...newCategories]}
                                        bordered={false}
                                        className='selector'
                                        onChange={handleCategoryChange}
                                        getPopupContainer={() => document.getElementById('gender')}

                                        loading={categoryLoading}
                                        options={allCategories && allCategories?.map(cat => ({ value: cat?._id, label: cat?.name }))}
                                        filterOption={filterOptions}
                                    />

                                </div>
                                {formErrors?.categories && <div className="errorMessage">{formErrors?.categories}</div>}

                            </div>
                            <div className="field1 field" id='tag'>
                                <div className="lableName">Tag</div>
                                <div className="inputselect">
                                    <div className="selecticon"><Tag size={24} className='iconInfo' /></div>
                                    <Select
                                        mode='tags'
                                        placeholder='Select tag'
                                        value={[...formData.tags, ...newtags]}
                                        bordered={false}
                                        className='selector'
                                        getPopupContainer={() => document.getElementById('tag')}

                                        onChange={handleTagChange}
                                        loading={tagLoading}
                                        options={allTags && allTags?.map(cat => ({ value: cat?._id, label: cat?.name }))}
                                        filterOption={filterOptionsfortags}
                                    />

                                </div>
                                {formErrors?.tags && <div className="errorMessage">{formErrors?.tags}</div>}

                            </div>
                            {/* <div className="field1 field">
                                <div className="lableName">Tag</div>
                                <div className="inputselect">
                                    <div className="selecticon"><Tag size={24} className='iconInfo' /></div>
                                    <Select
                                        mode='tags'
                                        placeholder='Select tag'
                                        value={[...formData.tags, ...newtags]}
                                        bordered={false}
                                        className='selector'
                                        onChange={handleTagChange}
                                        loading={tagLoading}
                                        options={allTags && allTags?.map(cat => ({ value: cat?._id, label: cat?.name }))}
                                    />
                                </div>
                            </div> */}
                        </div>
                        <div className="field2 field descriptionMain">
                            <div className="descriptionHeader heading">
                                Quiz Description
                            </div>
                            <div className="descriptionPara">
                                <ReactQuill parseWhitespace={true} theme='snow' style={{ height: "250px" }} modules={modules} className='contentPara' value={formData?.detail} name="detail" onChange={(val) => enterFormData({ target: { name: "detail", value: val } })} />
                            </div>
                            <div className="descriptionParaMobile">
                                {/* <ReactQuill parseWhitespace={true} theme='snow' style={{ height: "250px" }} modules={modulesMobile} className='contentPara' value={formData?.detail} name="detail" onChange={(val) => enterFormData({ target: { name: "detail", value: val } })} /> */}
                            </div>
                        </div>
                        {
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Button className="yellowGraBtn btn" style={{ width: "40px" }} onClick={handleUploadBook} loading={loading}>
                                    {selectedBook ? "Update" : "Save"}
                                </Button>
                            </div>

                        }
                    </div>
                </div>
            </div>
        </>
    )
}
