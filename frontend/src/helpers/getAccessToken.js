const tokenConfig = (getState) => {
    // Get token from state
    const token = getState().auth.token

    // Headers
    const config = {
        headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': 'pl',
        }
    }

    // If token, add to headers config
    if (token)
        config.headers['Authorization'] = `Bearer ${token}`

    return config
}

export default tokenConfig