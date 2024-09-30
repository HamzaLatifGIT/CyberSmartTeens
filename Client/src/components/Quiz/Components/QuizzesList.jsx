import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { BsBag } from 'react-icons/bs';
import { Select, Space } from "antd";
import "./QuizzesList.scss";


// Helpers
import { Bag2, Sort } from 'iconsax-react';
import { Button, Rate } from 'antd';
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";


const Categories = () => {

    const [showFullDescription, setshowFullDescription] = useState(false);
    const [showFullTitle, setshowFullTitle] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [sortedBooks, setSortedBooks] = useState([])
    const [sortOrder, setSortOrder] = useState("recent");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const [loading, setLoading] = useState(false)
    const Dispatch = useDispatch()

    // To fetch the all books through api
    const gettingAllBooks = async () => {
        setLoading(true)
        const res = await GetAllBooksAPI()
        if (res.error != null) {
            toast.error(res?.error)
        } else {
            let bookData = res?.data?.result || []
            Dispatch(BooksDataActions?.setBooksData(bookData))
        }
        setLoading(false)
    }
    useEffect(() => {
        gettingAllBooks()
    }, [])


    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    const BooksData = useSelector((state) => state?.BooksData);

    const navigate = useNavigate()

    const handleOneBook = (data) => {
        navigate('/libarary/detail', { state: { data: data } })
    }
    const shortenDescription = (text, maxLength) => {
        if (text?.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    };
    const shortenTitle = (text, maxLength) => {
        if (text?.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    };

    const freeBook = (cartData) => {
        navigate("/libarary/detail/free-book", { state: { bookData: cartData } });
    };

    const cart = useSelector((state) => state?.CartsData)
    const handleCarts = async (data) => {

        if (data && data.price > 0) {
            let result = []
            if (cart?.length >= 1) {
                Dispatch(SideBarDataActions?.setSideBarData({ sidemanu: true }))
                await cart?.filter((val) => {
                    let bookId = val?._id
                    if (bookId === data?._id) {
                        Dispatch(SideBarDataActions?.setSideBarData({ sidemanu: false }))
                        result.push(val)
                        return
                    }
                })
                if (result?.length < 1) {
                    Dispatch(CartsDataActions?.setCartsData(data))
                }
                else {
                    // toast.warning("Already In Cart")
                    showModal()
                    setTimeout(() => {
                        setIsModalOpen(false)
                    }, 1500);
                    return
                }
            }
            else {
                Dispatch(SideBarDataActions?.setSideBarData({ sidemanu: true }))
                Dispatch(CartsDataActions?.setCartsData(data))
            }
        } else {
            return
        }
    }

    // This is sorting funcyion to calculate the asc and decs
    const setBooksPrice = (data) => {
        if (!Array.isArray(data)) {
            return [];
        }
        const sortedData = [...data];
        sortedData.sort((a, b) => {
            if (sortOrder === "asc") {
                return a?.title.localeCompare(b?.title);
            } else if (sortOrder === "desc") {
                return b?.title.localeCompare(a?.title);
            }
            else if (sortOrder === "priceAsc") {
                return a?.price.localeCompare(b?.price);
            }
            else if (sortOrder === "priceDesc") {
                return b?.price.localeCompare(a?.price);
            }


            else if (sortOrder === "recent") {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            }
            return 0;
        });
        setSortedBooks(sortedData)
        return sortedData;
    };

    // after price all books data in it to render
    const filteredBooks = sortedBooks && sortedBooks.filter((book) => book.title.toLowerCase())

    // Sort filter handle change
    const handleSortOrderChange = (value) => {
        setSortOrder(value);
    };

    // Price filter handle change
    const handleChange = (value) => {
        setSelectedFilter(value);
    };

    useEffect(() => {
        let filterPrice = BooksData?.filter((data) => {
            if (selectedFilter === "all") return true;
            if (selectedFilter === "paid") return data?.price > 0;
            if (selectedFilter === "free") return !data?.price || data?.price <= 0;
        })
        setBooksPrice(filterPrice)
    }, [handleChange, handleSortOrderChange])


    let sortOptions = selectedFilter === "free" ? [
        { value: "asc", label: "Order (A To Z)" },
        { value: "desc", label: "Order (Z To A)" },
        { value: "recent", label: "Most Recent" },
    ]
        : [
            { value: "asc", label: "Order (A To Z)" },
            { value: "desc", label: "Order (Z To A)" },
            { value: "priceAsc", label: "Price (Low To High)" },
            { value: "priceDesc", label: "Price (High To Low)" },
            { value: "recent", label: "Most Recent" },
        ]




    return (
        <>
            <div className="category-container">

                <div className="category-cards container">
                    <div className="flex-heading">
                        <h3>Books</h3>
                        <div className="flex gap-2">
                            <div className="mr-3 flex items-center justify-center font-semibold">Sort By : </div>
                            <Select
                                id="sortOrder"
                                name="sortOrder"
                                value={sortOrder}
                                style={{ width: 150 }}
                                suffixIcon={<Sort color="#1f1f1f" />}
                                className="selectorMainBooks"
                                popupClassName="customSelector"
                                defaultValue="Most recent"
                                onChange={handleSortOrderChange}
                                options={sortOptions}
                            />

                            <Select
                                labelInValue
                                onChange={(value) => handleChange(value?.value)}
                                defaultValue="all"
                                style={{
                                    width: 120,
                                }}
                                options={[
                                    { value: 'all', label: 'All', },
                                    { value: 'paid', label: 'Paid', },
                                    { value: 'free', label: 'Free', },
                                ]}
                            />

                        </div>
                    </div>
                    <div>
                        {
                            loading ?
                                // <PreLoader />
                                <div className="skeleton">
                                    <Skeleton className="skel" variant="rectangular" />
                                    <Skeleton className="skel" variant="rectangular" />
                                    <Skeleton className="skel" variant="rectangular" />
                                    <Skeleton className="skel" variant="rectangular" />
                                    <Skeleton className="skel" variant="rectangular" />
                                    <Skeleton className="skel" variant="rectangular" />
                                </div>
                                :
                                <div className="cards">
                                    {filteredBooks.map((data, index) => {

                                        let allRatings = data?.reviews?.map(r => r?.value);
                                        let rating = 0;
                                        if (Array.isArray(allRatings) && allRatings.length >= 1) {
                                            rating = allRatings.reduce((x, y) => x + y);
                                            rating = rating / allRatings.length;
                                        }
                                        return (
                                            <div className="card" key={index} >
                                                <div className="img">
                                                    <img className="cardImage" src={ImgURLGEN(data?.image)} alt="" />
                                                </div>
                                                <div className="bio">
                                                    <div className="flex-bio">
                                                        <div className="heading" onClick={() => handleOneBook(data)}>
                                                            {showFullTitle ? data?.title?.replace(/<[^>]+>/g, '') : shortenTitle(data?.title?.replace(/<[^>]+>/g, ''), 20)}
                                                        </div>
                                                    </div>
                                                    <div className="stars">

                                                        <Rate value={rating} /> <span className="span">({allRatings?.length || 0})</span>
                                                    </div>
                                                    <div className="flex-price">
                                                        <div className="price">

                                                            <div className="pricehead">
                                                                Price:
                                                            </div>
                                                            <div className="pricepara">
                                                                {(!data?.price || data?.price < 1) ? "Free" : `$ ${data?.price}`}
                                                            </div>
                                                        </div>
                                                        <div className="primary-button2 ">

                                                            {
                                                                (data?.price < 1 || !data?.price) &&
                                                                <button className="pri2-btn" onClick={() => freeBook(data)}>
                                                                    <BsBag className='icon' /> Add to Bag
                                                                </button>
                                                            }
                                                            {
                                                                data?.price > 0 &&
                                                                <button className="pri2-btn" onClick={() => handleCarts(data)}>
                                                                    <BsBag className='icon' /> Add to Bag
                                                                </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                        }
                    </div>
                </div>
            </div>
            {isModalOpen && <MessagePrompt isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} message="Already In Cart" type={"warning"} />}
        </>
    );
};

export default Categories;
