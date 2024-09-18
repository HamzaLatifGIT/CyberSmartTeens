const express = require("express");
const router = express();
const categoryController = require("../Controllers/category");
const verifyToken = require('../Middlewares/verifyToken')
// const roles = require("../../constants/roles");



router.get("/", categoryController.getAllCategory);

router.use(verifyToken)

router.post("/", categoryController.addCategory);
router.get("/:id", categoryController.getCategoryById);
// router.delete("/:id",auth.restrictTo([roles.ADMIN, roles.SUPERADMIN]), categoryController.deleteCategoryById);
router.delete("/:id", categoryController.deleteCategoryById);

module.exports = router;