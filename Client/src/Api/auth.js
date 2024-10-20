import Axios from '../AxiosInstance'
import GetAuthToken from "../Utils/AuthToken"

const RegisterAPI = async ({ email, password, firstName, lastName, role }) => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/users/register",
            method: "POST",
            data: {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role
            }
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const LoginAPI = async ({ email, password }) => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/users/login",
            method: "POST",
            data: {
                email: email,
                password: password
            }
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const GetProfileAPI = async () => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/users/profile",
            method: "GET",
            headers: GetAuthToken(),
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const UpdateProfileAPI = async (data) => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/users/profile",
            method: "PATCH",
            headers: GetAuthToken(),
            data: data
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const GetAllStudentsAPI = async () => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/users/students",
            method: "GET",
            headers: GetAuthToken(),
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const GetDashboardStatisticsAPI = async () => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/dashboard/",
            method: "GET",
            headers: GetAuthToken(),
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const DeleteStudentAPI = async (id) => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: `/users/students/${id}`,
            method: "DELETE",
            headers: GetAuthToken(),
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

const CreateStudentAPI = async (data) => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: `/users/students`,
            method: "POST",
            data: data,
            headers: GetAuthToken(),
        })
        resolve.data = res.data
    } catch (err) {
        if (err && err?.response) {
            resolve.error = err?.response?.message || err?.response?.data?.message
        } else {
            resolve.error = "SomthingWent wrong"
        }
    }
    return resolve
}

export { RegisterAPI, LoginAPI, GetProfileAPI, UpdateProfileAPI, GetDashboardStatisticsAPI, GetAllStudentsAPI, CreateStudentAPI, DeleteStudentAPI }