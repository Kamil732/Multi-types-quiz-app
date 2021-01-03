import React, { Component } from 'react'
import PropTypes from 'prop-types'

class UserData extends Component {
    static propTypes = {
        picture_url: PropTypes.string,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="card__header">Your profile</div>
                    <div className="card__body">
                        <img src={this.props.picture_url} alt={this.props.username} />
                        <h1>Username - {this.props.username}</h1>
                        <h1>Email - {this.props.email}</h1>
                    </div>
                </div>
            </>
        )
    }
}

export default UserData
