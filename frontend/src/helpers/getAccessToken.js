import Cookies from 'js-cookie'

const tokenConfig = (getState, givenToken = false) => {
	const token = !givenToken ? getState().auth.token : getState

	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
		},
	}

	// If token, add to headers config
	if (token) config.headers['Authorization'] = `Bearer ${token}`
	config.headers['X-CSRFToken'] = Cookies.get('csrftoken')

	return config
}

export default tokenConfig
