import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'

// ANT-D :
import { Card, Select, Skeleton, Space } from "antd";
import { Button, Rate } from 'antd';

// Assets | ICONS :
import { CaretDownOutlined } from "@ant-design/icons";

// APIs :
import { GetAllPublicQuizesAPI } from "../../../Api/quiz";
import { GetAllCategoriesAPI } from "../../../Api/category";
// Helpers
import { toast } from "react-toastify";
import ImgURLGen from "../../../Utils/ImgUrlGen"

// CSS :
import "./QuizzesList.scss";





const QuizzesList = () => {

    const Navigate = useNavigate()

    const [quizzes, setQuizzes] = useState([]);
    const [allCategories, setAllCategories] = useState([{ value: "all", label: "All" }])
    const [cat, setCat] = useState("all")
    const [type, setType] = useState("all")

    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);



    const ShowDetails = (data) => {
        // if (data?.type == "flash" || data?.type == "puzzle") {
        //     Navigate("/card", { state: { data: data, AllQuizzes: quizzes } })
        // } else if (data?.type == "mcq" || data?.type == "open" || data?.type == "true") {
        //     Navigate("/mcqs", { state: data })
        // }
        Navigate("/card", { state: { data: data, AllQuizzes: quizzes } })
    }


    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const response = await GetAllPublicQuizesAPI();
                console.log(response)
                setTimeout(() => {
                    if (!response.error) {
                        // if (cat == "all") {
                        if (type == "all") {
                            setQuizzes(response.data?.result || [])
                        } else {
                            // let FilteredCourses = response.data?.result?.filter(course =>
                            //     course?.categories.some(category => category.name == cat)
                            // );
                            let FilteredQuizes = response.data?.result?.filter(quiz => quiz?.types?.includes(type));
                            setQuizzes(FilteredQuizes);
                        }
                    }
                    setLoading(false);
                }, 2000);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [type]);
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await GetAllCategoriesAPI();
            if (response.error != null) {

            } else {
                let Categories = response?.data?.result?.map(data => ({ value: data?.name, label: data?.name }))
                setAllCategories([
                    { value: "all", label: "All" },
                    ...Categories
                ])
            }
        };

        fetchCategories();
    }, [cat]);

    const handleShowAll = () => {
        setShowAll(true);
    };

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    // Price filter handle change
    const handleChange = (value) => {
        // setCat(value);
        setType(value);
    };


    let sortOptions = [
        { value: "all", label: "All" },
        { value: "mcq", label: "MCQs" },
        { value: "flash", label: "Flash Cards" },
        { value: "puzzle", label: "Puzzles" },
    ]

    return (
        <>
            <div className="quizzesListContainer">
                <div className="category-cards container">
                    <div className="flex-heading">
                        <h3>QUIZZES LIST</h3>
                        {/* <div className="flex gap-2">
                            <div className="mr-3 flex items-center justify-center font-semibold">Sort By : </div>
                            <Select
                                labelInValue
                                onChange={(value) => handleChange(value?.value)}
                                defaultValue="all"
                                style={{
                                    width: 120,
                                }}
                                value={type}
                                options={sortOptions}
                            />

                        </div> */}
                    </div>
                    <div className="items">
                        {loading ? (
                            <div className='card'>
                                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                    <Card key={index} className="item" style={{ width: '350px', marginBottom: 16, padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <Skeleton.Image active style={{ width: '300px', height: '200px', marginBottom: '1rem' }} />
                                        <Skeleton active paragraph={{ rows: 2 }} />
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            quizzes?.length >= 1 ?
                                <>
                                    <div className='card'>
                                        {quizzes.slice(0, showAll ? quizzes.length : 3).map((course, index) => (
                                            <div className="item" key={index} style={{ height: "470px" }}>
                                                <img src={course?.image && ImgURLGen(course?.image) || topic} alt={course?.title || 'Course'} onError={(e) => { e.target.onerror = null; e.target.src = NoImg; }} />
                                                <div className="content">
                                                    <div className="title">
                                                        <h4>Title:</h4> <p><i> {course?.title || 'Course Title'}  </i></p>
                                                    </div>
                                                    <div className="title">
                                                        <h4>Category:</h4> <p> {course?.categories?.map(cat => cat?.name).join(" , ") || 'Course Categories'} </p>
                                                    </div>
                                                    <div className="title">
                                                        <h4>Type:</h4> <p> {course?.types?.join(" , ").toLocaleUpperCase() || 'Course Categories'} </p>
                                                    </div>
                                                    <div className="title">
                                                        <h4>Details:</h4> <p> {course?.quote.length > 78 ? `${course?.quote.slice(0, 78)} ...` : course?.quote || 'Course description goes here.'} </p>
                                                    </div>
                                                    <Button className="btn" onClick={() => ShowDetails(course)}>
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='card'>
                                        {!showAll && quizzes.length > 3 && (
                                            <Button className="btn" onClick={handleShowAll}>
                                                Show All <CaretDownOutlined />
                                            </Button>
                                        )}
                                    </div>
                                </>
                                :
                                <div className="progressBox" style={{ height: "40vh" }}> No Quiz Found </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizzesList;
