const multer = require("multer");
const { memoryStorage } = require("multer");
// const AppError = require("./AppError");

const upload = multer({
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
        if (["image/png", "image/jpeg", "application/octet-stream"].includes(file.mimetype)
        ) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    `Not an image or Document file! Please upload only image or Document files`,
                ),
                false
            );
        }
    },
});

module.exports = upload;