const express = require("express");
const QuizModel = require("../Models/quiz");
const SubjectiveQuizModel = require("../Models/subjectiveQuizzes");
const UserModel = require("../Models/users.model")
const { uploadFile } = require("../../Utilities/uploader");



// This is the Blog Post API
const addQuiz = async (req, res) => {
    const currentUser = req.UserData;
    let data = req.body

    data.auther = currentUser?._id

    try {
        if (!data.title || data.title == "" || !data.type || data.type == "" || !req.file || req.file == "") {
            return res.status(400).json({ message: "Required Fields Missing" })
        }
        data.image = await uploadFile(req.file, data?.image?.url || null);
        if (req.body?.questions) {
            data.questions = JSON.parse(req.body.questions)
        }
        console.log(typeof data.questions);

        const newData = new QuizModel(data)
        await newData.save()
        res.status(200).json({ message: "Operation Successful", result: newData })
    } catch (err) {
        res.status(500).json({ message: "Server Error", err })
    }

}

// This is the Blog Get API
const getAllQuiz = async (req, res) => {
    try {
        let currentUser = req.UserData;
        let result;
        // if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(currentUser.role?.name) || currentUser?.isSuperAdmin) {
        //     result = await QuizModel.find({}).sort({ createdAt: -1 });
        // } else {
        result = await QuizModel.find({ auther: currentUser._id }).sort({ createdAt: -1 });
        // }
        res.status(200).json({ message: "Operation Successful", result: result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the get All Public Blog Which is Approve Data API
const getPublicQuiz = async (req, res) => {
    try {
        const result = await QuizModel.find({ status: "approved" })
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Get One Data API
const getQuizById = async (req, res) => {
    let QuizId = req.params.id
    try {
        const result = await QuizModel.findById(QuizId);
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

        let result = await QuizModel.findById(id);
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

        let result = await QuizModel.findById(id);
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
const reviewQuiz = async (req, res) => {
    const { blogId, status } = req.body;
    try {
        if (!status || status == "") {
            return res.status(400).json({ message: "Required Fields Missing" })
        }
        if (!(status == "approved" || status == "rejected" || status == "pending")) return res.status(400).json({ message: "Invalid Request" })

        const result = await QuizModel.findById(blogId)

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
const updateQuizById = async (req, res) => {
    const currentUser = req.UserData;
    const data = req.body;
    const QuizId = req.params.id;
    try {
        const FindOne = await QuizModel.findById(QuizId)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        // if (data.status) {
        //     return res.status(400).json({ message: "UnAuthorized Access" })
        // }
        if (data.isImgDel == "true") {
            data.image = {};
        } else {
            if (req.file) {
                data.image = await uploadFile(req.file, data?.image?.url || null);
            }
        }
        if (req.body?.questions) {
            data.questions = JSON.parse(req.body.questions)
        }
        // data.status = "pending";
        const result = await QuizModel.findByIdAndUpdate(QuizId, data, { new: true });
        return res.status(200).json({ message: "Operation Successful", result: result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Delete API
const deleteQuizById = async (req, res) => {
    const BlogId = req.params.id
    const currentUser = req.UserData
    try {
        const FindOne = await QuizModel.findById(BlogId)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        let result;
        // if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(currentUser.role?.name) || currentUser?.isSuperAdmin) {
        //     result = await QuizModel.findByIdAndDelete(BlogId);
        // } else {
        result = await QuizModel.findOneAndDelete({ _id: BlogId, auther: currentUser._id });
        // }
        return res.status(200).json({ message: "Operation Successful", result: result?._id })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}


const AttemptQuiz = async (req, res) => {
    const currentUser = req.UserData
    let AttemptData = req.body;
    try {
        const FindOne = await QuizModel.findById(AttemptData?.quizData)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        let FindUSer = await UserModel?.findById(currentUser?._id)
        FindUSer.quizAttempts.push(AttemptData)
        await FindUSer.save();
        return res.status(200).json({ message: "Operation Successful" })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}


const GetSubjectiveQuizzes = async (req, res) => {
    const currentUser = req.UserData
    try {
        const result = await SubjectiveQuizModel.find()
        return res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

const SubjectiveQuiz = async (req, res) => {
    const currentUser = req.UserData
    let AttemptData = req.body;
    try {
        const FindOne = await QuizModel.findById(AttemptData?.quizData)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }

        AttemptData.studentData = currentUser?._id
        let SubjectiveQuizData = await SubjectiveQuizModel.create(AttemptData)
        return res.status(200).json({ message: "Operation Successful" })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

module.exports = { addQuiz, getAllQuiz, getPublicQuiz, getQuizById, userReview, userComment, reviewQuiz, updateQuizById, deleteQuizById, AttemptQuiz, SubjectiveQuiz, GetSubjectiveQuizzes };