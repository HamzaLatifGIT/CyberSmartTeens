const useToken = () => {
    let token = localStorage.getItem("CyberTeensToken")
    let AuthToken = token ?? null

    return {
        Authorization: `Bearer ${AuthToken}`
    }
}

export default useToken;