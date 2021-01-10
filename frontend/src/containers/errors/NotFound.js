import React from 'react'
import { Link } from 'react-router-dom'
import not_found_img from '../../assets/images/not_found_img.png'

function NotFound() {
    return (
        <div className="error-container">
            <img src={not_found_img} alt="" />
            <h2>You won't find here anything</h2>
            <Link to="/" className="error-container__link">Take me back home</Link>
        </div>
    )
}

export default NotFound
