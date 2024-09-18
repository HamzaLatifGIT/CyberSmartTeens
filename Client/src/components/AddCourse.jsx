import React, { useEffect, useState } from 'react';

// MUI | ANT-D :
import { Button, Input, Upload, Select } from 'antd';

// Asserts | ICONS : 
import { LoadingOutlined } from '@ant-design/icons';
import { BsArrowLeftShort } from "react-icons/bs"
import { Blogger, Subtitle, Category, Tag, Eye } from 'iconsax-react';


// API's
// import { CreatBlogsAPI, UpdateBlogsAPI } from 'API/blogs';
// import { GetAllCategoriesAPI, GetAllTagsAPI, AddCategoryAPI, AddTagAPI } from 'API/categoryTag';
// Helper :
// import { toast } from 'react-toastify';
// import ImgURLGEN from 'Utils/ImgUrlGen';
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

export default function AddCourse({ allBlogs, selectedBlog, closeSubPage }) {

    const [allCategories, setAllCategories] = useState(null)
    const [allTags, setAllTags] = useState(null)

    const [newCategories, setNewCategories] = useState([])
    const [newtags, setNewtags] = useState([])

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [tagLoading, setTagLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formthumbUploadError, setFormthumbUploadError] = useState({});


    const [formData, setFormData] = useState({
        title: "",
        detail: "",
        image: null,
        quote: "",
        slug: "",
        categories: [],
        tags: []

    })
    const [formError, setFormError] = useState({
        title: null,
        detail: null,
        quote: null,
        slug: null,
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
    const filterOptionsfortags = (inputValue, option) => {
        return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    };
    const handleTagChange = (event) => {
        let newTagList = event.filter(cat => !allTags.some(v => cat == v?._id))
        let selectedTagList = allTags?.map(cat => cat?._id)?.filter(cat => event.includes(cat))
        setNewtags(newTagList)
        setFormData({
            ...formData,
            tags: selectedTagList
        })

    }

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
        const requiredFields = ["title", "quote", "detail", "slug"];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = "This field is required";
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }


    useEffect(() => {
        if (selectedBlog) {
            const findBlog = allBlogs?.find(val => val?._id == selectedBlog?._id)
            if (findBlog) {
                setFormData({
                    title: findBlog?.title,
                    quote: findBlog?.quote,
                    detail: findBlog?.detail,
                    slug: findBlog?.slug,
                    categories: findBlog?.categories.map(cat => cat?._id) || [],
                    tags: findBlog?.tags.map(tag => tag?._id) || [],
                    image: findBlog?.image

                })
                setImageUrl(ImgURLGEN(findBlog?.image))
            }
        } else {
            setFormData({
                title: "",
                quote: "",
                detail: "",
                slug: "",
                categories: [],
                tags: []
            })
            setImageUrl()
        }
    }, [selectedBlog])
    useEffect(() => {
        gettingAllCategories()
        gettingAllTags()
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
            fData.append("file", file)
        }
        let res;
        if (selectedBlog) {
            res = await UpdateBlogsAPI(selectedBlog?._id, fData)
        } else {
            res = await CreatBlogsAPI(fData)
        }
        if (res.error != null) {
            toast.error(res.error)
        } else {
            toast.success(res?.data?.message)
            closeSubPage()
        }
        setLoading(false)
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
                <div className="headingAddBlog">
                    <div className="headerleft heading upper flexLine flex">
                        
                        <div className="heading"><h2>Add Course</h2></div>
                    </div>

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
                                    <Eye
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
                                <Input prefix={<Subtitle />} size='large' className='blogInput' type="text" placeholder='Cpurse Title' name="title" onChange={enterFormData} value={formData?.title} />
                                {formErrors.title && <div className="errorMessage">{formErrors.title}</div>}
                            </div>
                            <div className="field2 field">
                                <div className="lableName">Course Slug</div>
                                <Input prefix={<Subtitle />} size='large' className='blogInput' type="text" placeholder='Course slug' name="slug" onChange={enterFormData} value={formData?.slug} />
                                {formErrors.slug && <div className="errorMessage">{formErrors.slug}</div>}
                            </div>

                        </div>
                        <div className="Inputfield">
                            <div className="field1 field">
                                <div className="lableName">Course Quote</div>
                                <Input prefix={<Blogger />} size='large' className='blogInput' type="text" placeholder='Course Quote' name="quote" onChange={enterFormData} value={formData?.quote} />
                                {formErrors.quote && <div className="errorMessage">{formErrors.quote}</div>}
                            </div>
                        </div>
                        <div className="Inputfield">
                            <div className="field1 field" id='category'>
                                <div className="lableName">Category</div>
                                <div className="inputselect">
                                    <div className="selecticon"><Category size={24} className='iconInfo' /></div>
                                    <Select
                                        mode='tags'
                                        placeholder='Select Category'
                                        value={[...formData.categories, ...newCategories]}
                                        bordered={false}
                                        className='selector'
                                        onChange={handleCategoryChange}
                                        getPopupContainer={() => document.getElementById('category')}

                                        loading={categoryLoading}
                                        options={allCategories && allCategories?.map(cat => ({ value: cat?._id, label: cat?.name }))}
                                        filterOption={filterOptions}
                                    />
                                </div>

                            </div>
                            <div className="field1 field" id='gender'>
                                <div className="lableName">Tag</div>
                                <div className="inputselect">
                                    <div className="selecticon"><Tag size={24} className='iconInfo' /></div>
                                    <Select
                                        mode='tags'
                                        placeholder='Select tag'
                                        value={[...formData.tags, ...newtags]}
                                        bordered={false}
                                        className='selector'
                                        getPopupContainer={() => document.getElementById('gender')}

                                        onChange={handleTagChange}
                                        loading={tagLoading}
                                        filterOption={filterOptionsfortags}
                                        options={allTags && allTags?.map(cat => ({ value: cat?._id, label: cat?.name }))}
                                    />

                                </div>

                            </div>
                        </div>
                        <div className="field2 field descriptionMain">
                            <div className="descriptionHeader heading">
                                Course Description
                            </div>
                            <div className="descriptionPara">
                                <ReactQuill theme='snow' formats={formats} modules={modules} style={{ height: "250px" }} className='contentPara' value={formData?.detail} name="detail" onChange={(val) => enterFormData({ target: { name: "detail", value: val } })} />

                            </div>

                            {/* <div className="descriptionParaMobile">
                                <ReactQuill theme='snow' formats={formats} modules={modulesMobile} style={{ height: "250px" }} className='contentPara' value={formData?.detail} name="detail" onChange={(val) => enterFormData({ target: { name: "detail", value: val } })} />
                            </div> */}
                        </div>
                        {
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Button className="btn" style={{ width: "40px" }} onClick={handleUploadBlog} loading={loading}>
                                    {selectedBlog ? "Update" : "Save"}
                                </Button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
