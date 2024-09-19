const express = require("express");
const router = express();
const verifyToken = require('../Middlewares/verifyToken')
const CourseController = require("../Controllers/course");
const Multer = require("../../Utilities/multer")


router.get("/public", CourseController.getPublicBlog);
router.use(verifyToken)

router.post("/", Multer.single("file"), CourseController.addBlog);
router.get("/", CourseController.getAllBlog);
router.get("/:id", CourseController.getBlogById);
router.post("/review", CourseController.userReview);
router.post("/comment", CourseController.userComment);
router.patch("/reviewBlog", CourseController.reviewBlog);
router.patch("/:id", Multer.single("file"), CourseController.updateBlogById);
router.delete("/:id", CourseController.deleteBlogById);

module.exports = router;