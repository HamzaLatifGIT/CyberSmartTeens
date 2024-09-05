import TempImg from "../assets/noImg.png"

const ImgURL = (imgObj) => {
    let BaseUrl = window.location.CustomURL;
    if (imgObj && imgObj?.storage && imgObj?.url) {
        if (imgObj?.storage == "local") {
            return `${BaseUrl}/static/${imgObj?.url}`
        } else if (imgObj?.storage == "react") {
            return imgObj?.url
        } else if (imgObj?.storage == "aws_s3") {
            return imgObj?.url
        }
    } else {
        return TempImg
    }
}

export default ImgURL