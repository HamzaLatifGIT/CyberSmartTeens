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
        if (!data.title || data.title == "" || !data.types || data.types == "" || !req.file || req.file == "") {
            return res.status(400).json({ message: "Required Fields Missing" })
        }
        data.image = await uploadFile(req.file, data?.image?.url || null);
        if (req.body?.types?.length >= 1) {
            data.types = JSON.parse(req.body.types)
        }
        if (req.body?.quizzes?.length >= 1) {
            data.quizzes = JSON.parse(req.body.quizzes)
        }

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
        if (req.body?.types?.length >= 1) {
            data.types = JSON.parse(req.body.types)
        }
        if (req.body?.quizzes?.length >= 1) {
            data.quizzes = JSON.parse(req.body.quizzes)
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
        const FindOne = await QuizModel.findOne({ "quizzes._id": AttemptData?.quizData })
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }

        AttemptData.quizId = AttemptData.quizData
        AttemptData.quizData = FindOne?._id
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
        const FindOne = await QuizModel.findOne({ "quizzes._id": AttemptData?.quizData })
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }

        AttemptData.quizId = AttemptData.quizData
        AttemptData.quizData = FindOne?._id
        AttemptData.studentData = currentUser?._id
        let SubjectiveQuizData = await SubjectiveQuizModel.create(AttemptData)
        return res.status(200).json({ message: "Operation Successful" })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

const SubjectiveQuizResult = async (req, res) => {
    const currentUser = req.UserData
    let Payload = req.body;
    try {
        const FindOne = await SubjectiveQuizModel.findById(Payload?._id)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }

        FindOne.correct = Payload.correct
        FindOne.wrong = Payload.wrong
        FindOne.attempts = Payload.attempts
        FindOne.status = "resulted"
        FindOne.save()

        let AttemptData = {
            correct: Payload.correct,
            wrong: Payload.wrong,
            quizData: FindOne?.quizData?._id,
            quizId: FindOne?.quizId,
            attempts: Payload?.attempts
        }
        let FindUSer = await UserModel?.findById(FindOne?.studentData?._id)
        FindUSer.quizAttempts.push(AttemptData)
        await FindUSer.save();

        return res.status(200).json({ message: "Operation Successful" })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}


const GetAllQuizzesResult = async (req, res) => {
    const currentUser = req.UserData
    try {
        const result = await UserModel.findById(currentUser?._id).populate("quizAttempts.quizData")
        return res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

module.exports = { addQuiz, getAllQuiz, getPublicQuiz, getQuizById, userReview, userComment, reviewQuiz, updateQuizById, deleteQuizById, AttemptQuiz, SubjectiveQuiz, GetSubjectiveQuizzes, SubjectiveQuizResult, GetAllQuizzesResult };