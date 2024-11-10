import axios from "../AxiosInstance";

// Helper :
import GetAuthToken from "../Utils/AuthToken"





const GetAllPublicQuizesAPI = async () => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/quiz/public",
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

const GetAllQuizesAPI = async () => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/quiz",
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

const CreatQuizAPI = async (formData) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/quiz",
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

const UpdateQuizAPI = async (id, formData) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: `/quiz/${id}`,
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

const ApproveQuizAPI = async (data) => {
    let resolved = {
        error: null,
        data: null
    }
    try {
        let res = await axios({
            url: `/quiz/reviewBlog`,
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

const DeleteQuizAPI = async (id) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: `/quiz/${id}`,
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

const attemptQuiz = async (formData) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: `/quiz/attempt`,
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


const SubjectiveQuizAttemptAPI = async (formData) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: `/quiz/subjective`,
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

const GetAllSubjectivesAPI = async () => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/quiz/subjective",
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

const SubjectivesQuizResultAPI = async (data) => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/quiz/subjective/result",
            method: "POST",
            data,
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

const GetAllQuizzesResultsAPI = async () => {
    let resolved = {
        error: null,
        data: null
    }

    try {
        let res = await axios({
            url: "/quiz/result",
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

export { GetAllPublicQuizesAPI, GetAllQuizesAPI, CreatQuizAPI, ApproveQuizAPI, DeleteQuizAPI, UpdateQuizAPI, attemptQuiz, GetAllSubjectivesAPI, SubjectiveQuizAttemptAPI, SubjectivesQuizResultAPI, GetAllQuizzesResultsAPI };