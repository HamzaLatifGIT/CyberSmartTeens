const mongoose = require('mongoose');





const QuestionsSchema = new mongoose.Schema({
    question: String,
    options: {
        type: Array,
        default: null
    },
    answer: String,
}, { _id: false })
const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course Title is Required"]
    },
    // detail: {
    //     type: String,
    //     required: [true, " Course Detail is Required"]
    // },
    image: {
        type: Object,
    },
    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    quote: {
        type: String,
    },
    isImgDel: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true,
        required: [true, "Slug is Required"]
    },
    questions: [QuestionsSchema],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryModel"
    }],
    review: [{
        UserData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        text: String,
        value: Number
    }],
    comments: [{
        UserData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        text: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    type: {
        type: String,
        require: true,
        enum: {
            values: ["flash", "quiz"],
            message: "Type must Be flash, quiz",
        },
    },
    status: {
        type: String,
        enum: {
            values: ["approved", "rejected", "pending"],
            message: "Status must Be approve, rejected or pending",
        },
        default: "approved",
        // default: "pending",
    },

},
    {
        timestamps: true,
    })

// BuildIn Methods :
QuizSchema.pre("find", function (next) {
    this.populate("auther categories comments.UserData")
    next();
})

const QuizModel = mongoose.model('quiz', QuizSchema)

module.exports = QuizModel;


