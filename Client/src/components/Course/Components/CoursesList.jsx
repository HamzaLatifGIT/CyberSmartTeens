import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'

// ANT-D :
import { Card, Select, Skeleton, Space } from "antd";
import { Button, Rate } from 'antd';

// Assets | ICONS :
import { BsBag } from 'react-icons/bs';
import { Bag2, Sort } from 'iconsax-react';
import { CaretDownOutlined } from "@ant-design/icons";

// APIs :
import { GetAllPublicCoursesAPI } from "../../../Api/course";
// Helpers
import { toast } from "react-toastify";
import ImgURLGen from "../../../Utils/ImgUrlGen"

// CSS :
import "./CoursesList.scss";
import { GetAllCategoriesAPI } from "../../../Api/category";





const CoursesList = () => {

    const Navigate = useNavigate()

    const [courses, setCourses] = useState([]);
    const [allCategories, setAllCategories] = useState([{ value: "all", label: "All" }])
    const [cat, setCat] = useState("all")

    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);



    const ViewCourse = (course) => {
        Navigate("/course", { state: { data: course, allCourses: courses } })
    }


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await GetAllPublicCoursesAPI();
                console.log(response)
                setTimeout(() => {
                    if (!response.error) {
                        if (cat == "all") {
                            setCourses(response.data?.result || [])
                        } else {
                            let FilteredCourses = response.data?.result?.filter(course =>
                                course?.categories.some(category => category.name == cat)
                            );
                            setCourses(FilteredCourses);
                        }
                    }
                    setLoading(false);
                }, 2000);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, [cat]);
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
        setCat(value);
    };



    return (
        <>
            <div className="coursesListContainer">
                <div className="category-cards container">
                    <div className="flex-heading">
                        <h3>COURSES LIST</h3>
                        <div className="flex gap-2">
                            <div className="mr-3 flex items-center justify-center font-semibold">Sort By : </div>
                            <Select
                                labelInValue
                                onChange={(value) => handleChange(value?.value)}
                                defaultValue="all"
                                style={{
                                    width: 120,
                                }}
                                value={cat}
                                options={allCategories}
                            />

                        </div>
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
                            courses?.length >= 1 ?
                                <>
                                    <div className='card'>
                                        {courses.slice(0, showAll ? courses.length : 3).map((course, index) => (
                                            <div className="item" key={index}>
                                                <img src={course?.image && ImgURLGen(course?.image) || topic} alt={course?.title || 'Course'} onError={(e) => { e.target.onerror = null; e.target.src = NoImg; }} />
                                                <div className="content">
                                                    <div className="title">
                                                        <h4>Title:</h4> <p><i> {course?.title || 'Course Title'}  </i></p>
                                                    </div>
                                                    <div className="title">
                                                        <h4>Category:</h4> <p> {course?.categories?.map(cat => cat?.title).join(",") || 'Course Categories'} </p>
                                                    </div>
                                                    <div className="title">
                                                        <h4>Details:</h4> <p> {course?.quote.length > 78 ? `${course?.quote.slice(0, 78)} ...` : course?.quote || 'Course description goes here.'} </p>
                                                    </div>
                                                    <Button className="btn" onClick={() => ViewCourse(course)}>
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='card'>
                                        {!showAll && courses.length > 3 && (
                                            <Button className="btn" onClick={handleShowAll}>
                                                Show All <CaretDownOutlined />
                                            </Button>
                                        )}
                                    </div>
                                </>
                                :
                                <div className="progressBox" style={{ height: "40vh" }}> No Course Found </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoursesList;
