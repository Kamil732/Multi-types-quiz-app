import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
	return (
		<div className="error-container">
			<h1>404 Page Not Found</h1>
			<h3>There's nothing here!</h3>
			<Link to="/" className="error-container__link">
				Take me back home
			</Link>
		</div>
	)
}

export default NotFound
