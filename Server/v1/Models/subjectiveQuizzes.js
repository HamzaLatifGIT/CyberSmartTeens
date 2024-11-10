const mongoose = require('mongoose');

const QuizModel = require("./quiz")



const SubjectiveQuizSchema = new mongoose.Schema({
    correct: Number,
    wrong: Number,
    studentData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    quizId: String,
    quizData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    },
    attempts: [{
        question: String,
        options: Array,
        correctAnswer: String,
        attempt: String,
        isCorrect: Boolean
    }],

    status: {
        type: String,
        enum: {
            values: ["pending", "resulted"],
            message: "Status must Be pending or resulted",
        },
        default: "pending",
    },

},
    {
        timestamps: true,
    })

// BuildIn Methods :
SubjectiveQuizSchema.pre("find", function (next) {
    this.populate("quizData studentData")
    next();
})

const SubjectiveQuizModel = mongoose.model('subjectiveQuiz', SubjectiveQuizSchema)

module.exports = SubjectiveQuizModel;


