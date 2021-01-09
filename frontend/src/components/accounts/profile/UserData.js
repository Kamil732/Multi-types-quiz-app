import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaEdit } from 'react-icons/fa'

class UserData extends Component {
    static propTypes = {
        isOwner: PropTypes.bool,
        picture_url: PropTypes.string,
        username: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        quizzes_count: PropTypes.number.isRequired,
        quizzes_solves: PropTypes.number.isRequired,
    }

    render() {
        const { isOwner, picture_url, username, bio, quizzes_count, quizzes_solves } = this.props

        const editField = isOwner ? (
            <button className="btn__edit">
                Edit <FaEdit size={20} className="btn__edit__icon" />
            </button>
        ) : ''

        return (
            <>
                <div className="card">
                    <div className="card__header">{ isOwner ? 'My Profile' : `${username} Profile` }</div>
                    <div className="card__body">
                        <div className="profile">
                            <div className="profile__img">
                                <img
                                    src={picture_url}
                                    alt={username}
                                    className={
                                        `img-rounded ${isOwner ? 'profile__img__edit' : ''}`
                                    }
                                />
                            </div>

                            <div className="profile__content">
                                <h2 className="profile__username">
                                    {username}
                                    {editField}
                                </h2>
                                <p className="profile__bio">
                                    {bio}
                                    {editField}
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
