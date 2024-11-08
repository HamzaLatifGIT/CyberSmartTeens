const express = require("express");
const router = express();
const verifyToken = require('../Middlewares/verifyToken')
const FlashCardController = require("../Controllers/flashCard");
const Multer = require("../../Utilities/multer")


router.get("/public", FlashCardController.getPublicFlashCards);
router.use(verifyToken)

router.post("/", Multer.single("file"), FlashCardController.addFlashCard);
router.get("/", FlashCardController.getFlashCards);
router.get("/:id", FlashCardController.getFlashCardById);
router.patch("/:id", Multer.single("file"), FlashCardController.updateFlashCardById);
router.delete("/:id", FlashCardController.deleteFlashCardById);

module.exports = router;