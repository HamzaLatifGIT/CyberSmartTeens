const express = require("express");
const CourseModel = require("../Models/course");
const { uploadFile } = require("../../Utilities/uploader");



// This is the Blog Post API
const addBlog = async (req, res) => {
    const currentUser = req.UserData;
    const data = req.body

    data.auther = currentUser?._id

    try {
        if (!data.title || data.title == "" || !req.file || req.file == "") {
            return res.status(400).json({ message: "Required Fields Missing" })
        }
        data.image = await uploadFile(req.file, data?.image?.url || null);
        if (data.lessons && data?.lessons?.length >= 1) {
            data.lessons = JSON.parse(data?.lessons)
        }
        const newData = new CourseModel(data)
        await newData.save()
        res.status(200).json({ message: "Operation Successful", result: newData })
    } catch (err) {
        res.status(500).json({ message: "Server Error", err })
    }

}

// This is the Blog Get API
const getAllBlog = async (req, res) => {
    try {
        let currentUser = req.UserData;
        let result;
        // if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(currentUser.role?.name) || currentUser?.isSuperAdmin) {
        //     result = await CourseModel.find({}).sort({ createdAt: -1 });
        // } else {
        result = await CourseModel.find({ auther: currentUser._id }).sort({ createdAt: -1 });
        // }
        res.status(200).json({ message: "Operation Successful", result: result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the get All Public Blog Which is Approve Data API
const getPublicBlog = async (req, res) => {
    try {
        const result = await CourseModel.find({ status: "approved" })
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Get One Data API
const getBlogById = async (req, res) => {
    let BlogId = req.params.id
    try {
        const result = await CourseModel.findById(BlogId);
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is update Review Blog API
const userReview = async (req, res) => {
    try {
        let currentUser = req.UserData;
        const { id, review } = req.body;

        if (!id || !review) {
            return res.status(400).json({ message: "Required Fields Missing", fields: ["id", "review"] })
        }

        let result = await CourseModel.findById(id);
        if (!result) return res.status(400).json({ message: "Not Found" })

        let updateReview = {
            UserData: currentUser?._id,
            text: review?.text,
            value: review?.value,
        }

        let findReview = result?.review?.find(review => review?.UserData == currentUser?._id)
        if (findReview) {
            let updatedReview = result?.review.map(review => {
                if (review?.UserData == currentUser?._id) return updateReview;
                return review;
            })
            result.review = updatedReview;
        } else {
            result.review.push(updateReview);
        }
        await result.save();

        return res.status(200).json({ message: "Operation Successful", result })

    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}
// This is update Review Blog API
const userComment = async (req, res) => {
    try {
        let currentUser = req.UserData;
        const { id, comment } = req.body;

        if (!id || !comment) {
            return res.status(400).json({ message: "Required Fields Missing", fields: ["id", "comment"] })
        }

        let result = await CourseModel.findById(id);
        if (!result) return res.status(400).json({ message: "Not Found" })

        let newComment = {
            UserData: currentUser?._id,
            text: comment,
        }

        result.comments.push(newComment);
        await result.save();

        return res.status(200).json({ message: "Operation Successful", result })

    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is update Review Blog API
const reviewBlog = async (req, res) => {
    const { blogId, status } = req.body;
    try {
        if (!status || status == "") {
            return res.status(400).json({ message: "Required Fields Missing" })
        }
        if (!(status == "approved" || status == "rejected" || status == "pending")) return res.status(400).json({ message: "Invalid Request" })

        const result = await CourseModel.findById(blogId)

        if (!result) return res.status(400).json({ message: "Not Found" })
        if (!result.status == "pending") return res.status(400).json({ message: "Operation Successful" })

        result.status = status;
        await result.save();

        return res.status(200).json({ message: "Operation Successful", result })

    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Patch API
const updateBlogById = async (req, res) => {
    const currentUser = req.UserData;
    const data = req.body;
    const BlogId = req.params.id;
    try {
        const FindOne = await CourseModel.findById(BlogId)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        if (data.status) {
            return res.status(400).json({ message: "UnAuthorized Access" })
        }
        if (data.isImgDel == "true") {
            data.image = {};
        } else {
            if (req.file) {
                data.image = await uploadFile(req.file, data?.image?.url || null);
            }
        }
        if (data.lessons && data?.lessons?.length >= 1) {
            data.lessons = JSON.parse(data?.lessons)
        }
        // data.status = "pending";
        const result = await CourseModel.findByIdAndUpdate(BlogId, data, { new: true });
        return res.status(200).json({ message: "Operation Successful", result: result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Delete API
const deleteBlogById = async (req, res) => {
    const BlogId = req.params.id
    const currentUser = req.UserData
    try {
        const FindOne = await CourseModel.findById(BlogId)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        let result;
        // if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(currentUser.role?.name) || currentUser?.isSuperAdmin) {
        //     result = await CourseModel.findByIdAndDelete(BlogId);
        // } else {
        result = await CourseModel.findOneAndDelete({ _id: BlogId, auther: currentUser._id });
        // }
        return res.status(200).json({ message: "Operation Successful", result: result?._id })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

module.exports = { addBlog, getAllBlog, getPublicBlog, getBlogById, userReview, userComment, reviewBlog, updateBlogById, deleteBlogById };