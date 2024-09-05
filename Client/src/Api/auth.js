import Axios from '../AxiosInstance'
import GetAuthToken from "../Utils/AuthToken"

const RegisterAPI = async ({ email, password, firstName, lastName }) => {
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
                lastName: lastName
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


export { RegisterAPI, LoginAPI, GetProfileAPI, UpdateProfileAPI }