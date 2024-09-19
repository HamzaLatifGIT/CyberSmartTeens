const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course Title is Required"]
    },
    detail: {
        type: String,
        required: [true, " Course Detail is Required"]
    },
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
        default: "pending",
    },

},
    {
        timestamps: true,
    })

// BuildIn Methods :
CourseSchema.pre("find", function (next) {
    this.populate("auther categories comments.UserData")
    next();
})

const CourseModel = mongoose.model('course', CourseSchema)

module.exports = CourseModel;


