const express = require("express");
const FlashCardModel = require("../Models/flashCard");
const UserModel = require("../Models/users.model")
const { uploadFile } = require("../../Utilities/uploader");



// This is the Blog Post API
const addFlashCard = async (req, res) => {
    const currentUser = req.UserData;
    let data = req.body

    data.auther = currentUser?._id

    try {
        if (!data.title || data.title == "" || !req.file || req.file == "") {
            return res.status(400).json({ message: "Required Fields Missing" })
        }
        data.image = await uploadFile(req.file, data?.image?.url || null);
        if (req.body?.questions?.length >= 1) {
            data.questions = JSON.parse(req.body.questions)
        }

        const newData = new FlashCardModel(data)
        await newData.save()
        res.status(200).json({ message: "Operation Successful", result: newData })
    } catch (err) {
        res.status(500).json({ message: "Server Error", err })
    }

}

// This is the Blog Get API
const getFlashCards = async (req, res) => {
    try {
        let currentUser = req.UserData;
        let result;
        // if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(currentUser.role?.name) || currentUser?.isSuperAdmin) {
        //     result = await FlashCardModel.find({}).sort({ createdAt: -1 });
        // } else {
        result = await FlashCardModel.find({ auther: currentUser._id }).sort({ createdAt: -1 });
        // }
        res.status(200).json({ message: "Operation Successful", result: result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the get All Public Blog Which is Approve Data API
const getPublicFlashCards = async (req, res) => {
    try {
        const result = await FlashCardModel.find({ status: "approved" })
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Get One Data API
const getFlashCardById = async (req, res) => {
    let id = req.params.id
    try {
        const result = await FlashCardModel.findById(id);
        res.status(200).json({ message: "Operation Successful", result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Patch API
const updateFlashCardById = async (req, res) => {
    const currentUser = req.UserData;
    const data = req.body;
    const id = req.params.id;
    try {
        const FindOne = await FlashCardModel.findById(id)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        // if (data.status) {
        //     return res.status(400).json({ message: "UnAuthorized Access" })
        // }
        if (data.isImgDel == "true") {
            data.image = {};
        } else {
            if (req.file) {
                data.image = await uploadFile(req.file, data?.image?.url || null);
            }
        }
        if (req.body?.questions?.length >= 1) {
            data.questions = JSON.parse(req.body.questions)
        }
        const result = await FlashCardModel.findByIdAndUpdate(id, data, { new: true });
        return res.status(200).json({ message: "Operation Successful", result: result })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

// This is the Blog Delete API
const deleteFlashCardById = async (req, res) => {
    const BlogId = req.params.id
    const currentUser = req.UserData
    try {
        const FindOne = await FlashCardModel.findById(BlogId)
        if (!FindOne) {
            return res.status(400).json({ message: "Not Found" })
        }
        let result;
        // if ([ROLES.ADMIN, ROLES.SUPERADMIN].includes(currentUser.role?.name) || currentUser?.isSuperAdmin) {
        //     result = await FlashCardModel.findByIdAndDelete(BlogId);
        // } else {
        result = await FlashCardModel.findOneAndDelete({ _id: BlogId, auther: currentUser._id });
        // }
        return res.status(200).json({ message: "Operation Successful", result: result?._id })
    } catch (err) {
        res.status(400).json({ message: "Server Error", err })
    }
}

module.exports = { addFlashCard, getFlashCards, getPublicFlashCards, getFlashCardById, updateFlashCardById, deleteFlashCardById };