const express = require('express')
const router = express.Router()
const userController = require('../Controllers/users.controller')
const verifyToken = require('../Middlewares/verifyToken')
const Multer = require("../../Utilities/multer")

// login user
router.post('/login', userController.Loginuser)

// Register user
router.post('/register', userController.RegisterUser)

// get user profile
router.get('/profile', verifyToken, userController.getUserProfile)
// Update user profile
router.patch("/profile", [verifyToken, Multer.single("file")], userController.updateUserProfile)

// Students
router.get("/students", userController.allStudents)

module.exports = router
