import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaEdit } from 'react-icons/fa'
import Textarea from '../../../common/Textarea'

class UserData extends Component {
    static propTypes = {
        isOwner: PropTypes.bool,
        picture_url: PropTypes.string,
        username: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        quizzes_count: PropTypes.number.isRequired,
        quizzes_solves: PropTypes.number.isRequired,
        errors: PropTypes.object,
        removeError: PropTypes.func.isRequired,
        updateUserData: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.uploadContainer = React.createRef()

        this.state = {
            picture: null,
            picturePreview: this.props.picture_url,
            username: this.props.username,
            bio: this.props.bio,
            picture_edit_mode: false,
            username_edit_mode: false,
            bio_edit_mode: false,
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    handleImageChange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()

        if (file && file.type.match('image.*'))
            reader.readAsDataURL(e.target.files[0])

        reader.onloadend = () =>
            this.setState({
                picture: file,
                picturePreview: reader.result,
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.username !== this.props.username ||
            prevProps.bio !== this.props.bio ||
            prevProps.picture_url !== this.props.picture_url)
                this.setState({
                    username: this.props.username,
                    bio: this.props.bio,
                    picturePreview: this.props.picture_url,
                })
    }

    onSubmit = async (e, field) => {
        e.preventDefault()

        this.props.removeError(field)
        await this.props.updateUserData({ [field]: this.state[field] })

        if (this.props.errors[field] === undefined)
            this.setState({ [`${field}_edit_mode`]: false })
    }

    render() {
        const { isOwner, quizzes_count, quizzes_solves, errors } = this.props
        const { picturePreview, username, bio, username_edit_mode, bio_edit_mode } = this.state

        return (
            <>
                <div className="card">
                    <div className="card__header">{ isOwner ? 'My Profile' : `${username}'s Profile` }</div>
                    <div className="card__body">
                        <div className="profile">
                            <div className={`profile__img ${isOwner ? 'owner' : ''}`}>
                                <img src={picturePreview} alt={username} draggable="false" className="img-rounded" />
                                {
                                    isOwner ? (
                                        <form onSubmit={e => this.onSubmit(e, 'picture')}>
                                            {
                                                errors.picture ? (
                                                    <div className="error-box">
                                                        {
                                                            errors.picture.map((error, index) => (
                                                                <p className="error-text" key={index}>{error}</p>
                                                            ))
                                                        }
                                                    </div>
                                                ) : null
                                            }
                                            <label className="btn__upload">
                                                <div className="btn__upload__container" ref={this.uploadContainer}>
                                                    Click or drop an image here
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg"
                                                    className="btn__upload__field"
                                                    onChange={this.handleImageChange}
                                                    onDragOver={() => this.uploadContainer.current.classList.add('dragover')}
                                                    onDragLeave={() => this.uploadContainer.current.classList.remove('dragover')}
                                                />
                                            </label>
                                            <button className="btn">
                                                Save
                                            </button>
                                        </form>
                                    ) : null
                                }
                            </div>

                            <div className="profile__content">
                                <div className="profile__username">
                                    {
                                        username_edit_mode ? (
                                            <form onSubmit={e => this.onSubmit(e, 'username')}>
                                                {
                                                    errors.username ? (
                                                        <div className="error-box">
                                                            {
                                                                errors.username.map((error, index) => (
                                                                    <p className="error-text" key={index}>{error}</p>
                                                                ))
                                                            }
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="form-control">
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        className="form-control__input"
                                                        value={username}
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                                <button className="btn">
                                                    Save
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                {username}
                                                {
                                                    isOwner ? (
                                                        <button className="btn__edit" onClick={() => this.setState({ username_edit_mode: true })}>
                                                            Edit <FaEdit />
                                                        </button>
                                                    ) : null
                                                }
                                            </>
                                        )
                                    }
                                </div>
                                <div className="profile__bio">
                                    {
                                        bio_edit_mode ? (
                                            <form onSubmit={e => this.onSubmit(e, 'bio')}>
                                                {
                                                    errors.bio ? (
                                                        <div className="error-box">
                                                            {
                                                                errors.bio.map((error, index) => (
                                                                    <p className="error-text" key={index}>{error}</p>
                                                                ))
                                                            }
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="form-control">
                                                    <Textarea
                                                        name="bio"
                                                        value={bio}
                                                        onChange={this.onChange}
                                                        className="form-control__input form-control__textarea"
                                                        rows="10"
                                                    />
                                                </div>
                                                <button className="btn">
                                                    Save
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                { bio ? bio : 'Welcome to my profile!' }
                                                {
                                                    isOwner ? (
                                                        <button className="btn__edit" onClick={() => this.setState({ bio_edit_mode: true })}>
                                                            Edit <FaEdit />
                                                        </button>
                                                    ) : null
                                                }
                                            </>
                                        )
                                    }
                                </div>
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
