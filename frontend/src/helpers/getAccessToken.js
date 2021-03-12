const tokenConfig = (getState, givenToken = false) => {
	const token = !givenToken ? getState().auth.token : getState

	// Headers
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
		},
	}

	// If token, add to headers config
	if (token) config.headers['Authorization'] = `Bearer ${token}`

	return config
}

export default tokenConfig
