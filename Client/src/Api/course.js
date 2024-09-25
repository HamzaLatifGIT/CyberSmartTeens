import axios from "../AxiosInstance";

// Helper :
import GetAuthToken from "../Utils/AuthToken"





const GetAllCoursesAPI = async () => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/course",
            method: "GET",
            headers: GetAuthToken()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}

const GetAllPublicCoursesAPI = async () => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/course/public",
            method: "GET",
           
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}

const CreatCoursesAPI = async (formData) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/course",
            method: "POST",
            data: formData,
            headers: GetAuthToken()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}

const UpdateCourseAPI = async (id, formData) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: `/course/${id}`,
            method: "PATCH",
            data: formData,
            headers: GetAuthToken()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}

const ApproveCoursesAPI = async (data) => {
    let resolved = {
        error: null,
        data: null
    }
    try {
        let res = await axios({
            url: `/course/reviewBlog`,
            method: "PATCH",
            data: data,
            headers: GetAuthToken()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}

const DeleteCourseAPI = async (id) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: `/course/${id}`,
            method: "DELETE",
            headers: GetAuthToken()
        })
        resolved.data = res.data
    } catch (err) {
        if (err && err.response && err?.response?.data?.message) {
            resolved.error = err.response.data.message
        } else {
            resolved.error = "Something went Wrong"
        }
    }
    return resolved;
}


export { GetAllCoursesAPI, CreatCoursesAPI, ApproveCoursesAPI, DeleteCourseAPI, UpdateCourseAPI,GetAllPublicCoursesAPI };