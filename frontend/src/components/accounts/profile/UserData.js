import React, { Component } from 'react'
import PropTypes from 'prop-types'

class UserData extends Component {
    static propTypes = {
        picture_url: PropTypes.string,
        username: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        quizzes_count: PropTypes.number.isRequired,
        quizzes_solves: PropTypes.number.isRequired,
    }

    render() {
        const { picture_url, username, bio, quizzes_count, quizzes_solves } = this.props

        return (
            <>
                <div className="card">
                    <div className="card__header">Your profile</div>
                    <div className="card__body">
                        <div className="profile">
                            <img src={picture_url} alt={username} className="profile__img img-rounded" />

                            <div className="profile__content">
                                <h2 className="profile__username">{username}</h2>
                                <p className="profile__bio">
                                    {bio}
                                </p>
                                <p style={{ fontSize: '1.1rem' }}>
                                    QUIZZES: {quizzes_count}
                                    &nbsp;&nbsp;
                                    &bull;
                                    &nbsp;&nbsp;
                                    SOLVES: {quizzes_solves}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default UserData
