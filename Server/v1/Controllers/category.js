const category = require("../Models/category");



// This is the Category Post API
const addCategory = async (req, res) => {
    const currentUser = req.user;
    const data = req.body

    try {
        if (!data || !data.length >= 1 || data.includes(" ")) {
            res.status(304).json({ message: "Required Fields Missing" })
        }

        let result = []

        let CreatingCategories = data.map(async (val) => {
            let res = await category.create({ name: val })
            result.push(res)
        });

        await Promise.all(CreatingCategories)

        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(500).json({ message: "Server Error", err })
    }
}

// This is the Category Get API
const getAllCategory = async (req, res) => {
    try {
        let currentUser = req.user;

        let result = await category.find();
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Category Get One Data API
const getCategoryById = async (req, res) => {
    let categoryId = req.params.id
    try {
        const result = await category.findById(categoryId);
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}


// This is the Category Delete API
const deleteCategoryById = async (req, res) => {
    const categoryId = req.params.id
    try {
        const result = await category.findByIdAndDelete(categoryId);
        res.status(200).json({ message: "Operation Successful" })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

module.exports = { addCategory, getAllCategory, getCategoryById, deleteCategoryById };