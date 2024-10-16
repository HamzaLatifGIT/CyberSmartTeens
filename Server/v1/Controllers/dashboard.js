const express = require("express");
const UserModel = require("../Models/users.model");
const QuizModel = require("../Models/quiz");
const CoursesModel = require("../Models/course");
const jwt = require("jsonwebtoken");
const JWT = require("../../Utilities/generateToken");
const { uploadFile } = require("../../Utilities/uploader");




require("dotenv").config();

// Login User
exports.DashboardStatistics = async (req, res) => {
    try {
        let UserData = req?.UserData


        let AllQuizzes = await QuizModel.find()
        let Score = 0
        let CalScore = await UserData?.quizAttempts?.map(data => {
            Score = Score + Number(data?.correct)
        })

        let AllStudents = await UserModel.find({ role: "Student" })
        let MyLessons = await CoursesModel.find({ auther: UserData?._id })
        let MyQuizzes = await QuizModel.find({ auther: UserData?._id })

        let Cards = []

        if (UserData?.role == "Teacher") {
            Cards = [
                {
                    title: "Total Students",
                    value: AllStudents?.length || 0
                },
                {
                    title: "Total Lessons",
                    value: MyLessons?.length || 0
                },
                {
                    title: "Total Quizzes",
                    value: MyQuizzes?.length || 0
                }
            ]
        } else {
            Cards = [
                {
                    title: "Total Quizzes",
                    value: AllQuizzes?.length || 0
                },
                {
                    title: "Total Attempts",
                    value: UserData?.quizAttempts?.length || 0
                },
                {
                    title: "Total Score",
                    value: Score
                }
            ]
        }
        res.status(200).json({ message: "Operation Successful", result: { Cards } })
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
};

