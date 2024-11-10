const express = require("express");
const router = express();
const verifyToken = require('../Middlewares/verifyToken')
const QuizController = require("../Controllers/quiz");
const Multer = require("../../Utilities/multer")


router.get("/public", QuizController.getPublicQuiz);
router.use(verifyToken)

router.post("/", Multer.single("file"), QuizController.addQuiz);
router.get("/", QuizController.getAllQuiz);
router.post("/attempt", QuizController.AttemptQuiz);
router.get("/result", QuizController.GetAllQuizzesResult);
router.get("/subjective", QuizController.GetSubjectiveQuizzes);
router.post("/subjective", QuizController.SubjectiveQuiz);
router.post("/subjective/result", QuizController.SubjectiveQuizResult);
router.get("/:id", QuizController.getQuizById);
router.post("/review", QuizController.userReview);
router.post("/comment", QuizController.userComment);
router.patch("/reviewBlog", QuizController.reviewQuiz);
router.patch("/:id", Multer.single("file"), QuizController.updateQuizById);
router.delete("/:id", QuizController.deleteQuizById);

module.exports = router;