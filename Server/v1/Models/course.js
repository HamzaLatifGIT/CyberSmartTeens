const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course Title is Required"]
    },
    detail: {
        type: String,
        // required: [true, " Course Detail is Required"]
    },
    lessons: [String],
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
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    },
    flashCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "flashCard"
    },
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
CourseSchema.pre("find", function (next) {
    this.populate("auther categories quiz flashCard comments.UserData")
    next();
})

const CourseModel = mongoose.model('course', CourseSchema)

module.exports = CourseModel;


