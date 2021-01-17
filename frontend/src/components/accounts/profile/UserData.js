import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FaEdit } from 'react-icons/fa'
import Textarea from '../../../common/Textarea'

class UserData extends Component {
    static propTypes = {
        isOwner: PropTypes.bool,
        picture: PropTypes.string,
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
            picturePreview: this.props.picture,
            username: this.props.username,
            bio: this.props.bio,
            picture_edit_mode: false,
            username_edit_mode: false,
            bio_edit_mode: false,
        }

        this.onChange = this.onChange.bind(this)
        this.handleImageChange = this.handleImageChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
    }

    setEdit = field => {
        this.props.removeError(field)
        this.setState({ [`${field}_edit_mode`]: !this.state[`${field}_edit_mode`] })
    }

    closeEdit = field => {
        this.setEdit(field)
        this.setState({ [field]: this.props[field] })
    }

    closeEditImage = () => {
        this.setEdit('picture')
        this.setState({
            picture: null,
            picturePreview: this.props.picture,
        })
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

    deleteImage = e => {
        this.props.updateUserData({ picture: '' })

        this.props.removeError('picture')
        this.setEdit('picture')
    }

    onSubmit = async (e, field) => {
        e.preventDefault()

        this.props.removeError(field)
        await this.props.updateUserData({ [field]: this.state[field] })

        if (this.props.errors[field] === undefined)
            this.setState({ [`${field}_edit_mode`]: false })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.username !== this.props.username ||
            prevProps.bio !== this.props.bio ||
            prevProps.picture !== this.props.picture)
                this.setState({
                    username: this.props.username,
                    bio: this.props.bio,
                    picturePreview: this.props.picture,
                })
    }

    render() {
        const { isOwner, quizzes_count, quizzes_solves, errors } = this.props
        const { picturePreview, username, bio, picture_edit_mode, username_edit_mode, bio_edit_mode } = this.state

        return (
            <>
                <div className="card">
                    <div className="card__header">{ isOwner ? 'My Profile' : `${username}'s Profile` }</div>
                    <div className="card__body">
                        <div className="profile">
                            <div className="profile__img">
                                <img src={picturePreview} alt={username} draggable="false" className="img-rounded" />
                                {
                                    picture_edit_mode ? (
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
                                            <div style={{ display: 'inline-flex', gap: '10px', flexWrap: 'wrap', margin: '0 auto' }}>
                                                <button className="btn btn__contrast">
                                                    Save
                                                </button>
                                                <button className="btn btn__danger" onClick={e => e.preventDefault()} onDoubleClick={() => this.deleteImage()}>
                                                    delete (dobule click)
                                                </button>
                                                <button className="btn" onClick={this.closeEditImage}>
                                                    Close
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            {
                                                isOwner ? (
                                                    <button className="btn" onClick={() => this.setEdit('picture')}>
                                                        Edit <FaEdit />
                                                    </button>
                                                ) : null
                                            }
                                        </>
                                    )
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
                                                <div style={{ display: 'inline-flex', gap: '10px' }}>
                                                    <button className="btn btn__contrast">
                                                        Save
                                                    </button>
                                                    <button className="btn" onClick={() => this.closeEdit('username')}>
                                                        Close
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                {username}
                                                {
                                                    isOwner ? (
                                                        <button className="btn__edit" onClick={() => this.setEdit('username')}>
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
                                                <div style={{ display: 'inline-flex', gap: '10px' }}>
                                                    <button className="btn btn__contrast">
                                                        Save
                                                    </button>
                                                    <button className="btn" onClick={() => this.closeEdit('bio')}>
                                                        Close
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                { bio ? bio : 'Welcome to my profile!' }
                                                {
                                                    isOwner ? (
                                                        <button className="btn__edit" onClick={() => this.setEdit('bio')}>
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
