import Axios from '../AxiosInstance'
import GetAuthToken from "../Utils/AuthToken"

const GetAllCategoriesAPI = async () => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/category",
            method: "GET",
            headers: GetAuthToken()
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


const AddCategoryAPI = async (data) => {
    let resolve = {
        data: null,
        error: null
    }
    try {
        let res = await Axios({
            url: "/category",
            method: "POST",
            data,
            headers: GetAuthToken()
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



export { GetAllCategoriesAPI, AddCategoryAPI } 