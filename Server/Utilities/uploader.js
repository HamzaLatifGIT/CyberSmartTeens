const localUploader = require("./localUploader")



let Platform = process.env?.UPLOADER_PLATFORM || "local"
const uploadFile = (...props) => {
    if (Platform == "aws_s3") {
        // return s3Uploader.uploadFile(...props)
    } else {
        return localUploader.uploadFile(...props)
    }
}

const uploadArrayOfFiles = (file, prevName) => {
    if (Platform == "aws_s3") {
        // return s3Uploader.uploadArrayOfFiles
    } else {
        return localUploader.uploadArrayOfFiles
    }
}

module.exports = { uploadFile, uploadArrayOfFiles }