const express = require('express')
const router = express.Router()
const dashboardController = require('../Controllers/dashboard')
const verifyToken = require('../Middlewares/verifyToken')

// login user
router.get('/', verifyToken, dashboardController.DashboardStatistics)

module.exports = router
