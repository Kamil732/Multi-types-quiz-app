import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FaEdit } from 'react-icons/fa'

import Swal from 'sweetalert2'
import Textarea from '../../Textarea'

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
		this.setEdit = this.setEdit.bind(this)
		this.cancelEdit = this.cancelEdit.bind(this)
		this.cancelEditImage = this.cancelEditImage.bind(this)
		this.deleteImage = this.deleteImage.bind(this)
	}

	setEdit = (field) => {
		this.props.removeError(field)
		this.setState({
			[`${field}_edit_mode`]: !this.state[`${field}_edit_mode`],
		})
	}

	cancelEdit = (field) => {
		this.setEdit(field)
		this.setState({ [field]: this.props[field] })
	}

	cancelEditImage = () => {
		this.setEdit('picture')
		this.setState({
			picture: null,
			picturePreview: this.props.picture,
		})
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	handleImageChange = (e) => {
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

	deleteImage = (e) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'Are you sure you want to delete your profile picture?',
			icon: 'warning',
			showCancelButton: true,
			customClass: {
				confirmButton: 'btn btn__danger',
				cancelButton: 'btn',
			},
			buttonsStyling: false,
			confirmButtonText: 'delete',
		}).then((res) => {
			if (res.isConfirmed) {
				this.props.updateUserData({ picture: '' })

				this.props.removeError('picture')
				this.setEdit('picture')
			}
		})
	}

	onSubmit = async (e, field) => {
		e.preventDefault()

		this.props.removeError(field)
		await this.props.updateUserData({ [field]: this.state[field] })

		if (this.props.errors[field] === undefined)
			this.setState({ [`${field}_edit_mode`]: false })
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.username !== this.props.username ||
			prevProps.bio !== this.props.bio ||
			prevProps.picture !== this.props.picture
		)
			this.setState({
				username: this.props.username,
				bio: this.props.bio,
				picturePreview: this.props.picture,
			})
	}

	render() {
		const { isOwner, quizzes_count, quizzes_solves, errors } = this.props
		const {
			picturePreview,
			username,
			bio,
			picture_edit_mode,
			username_edit_mode,
			bio_edit_mode,
		} = this.state

		return (
			<>
				<div className="card">
					<div className="card__header">
						{isOwner ? 'My Profile' : `${username}'s Profile`}
					</div>
					<div className="card__body">
						<div className="profile">
							<div className="profile__img">
								<img
									src={picturePreview}
									alt={username}
									draggable="false"
									className="img-rounded"
								/>
								{isOwner && picture_edit_mode ? (
									<form
										onSubmit={(e) =>
											this.onSubmit(e, 'picture')
										}
									>
										{errors.picture ? (
											<div className="message-box error">
												{errors.picture.map(
													(error, index) => (
														<p
															className="message-box__text"
															key={index}
														>
															{error}
														</p>
													)
												)}
											</div>
										) : null}
										<label className="btn__upload">
											<div
												className="btn__upload__container"
												ref={this.uploadContainer}
											>
												Click or drop an image here
											</div>

											<input
												type="file"
												accept="image/png, image/jpeg"
												className="btn__upload__field"
												onChange={
													this.handleImageChange
												}
												onDragOver={() =>
													this.uploadContainer.current.classList.add(
														'dragover'
													)
												}
												onDragLeave={() =>
													this.uploadContainer.current.classList.remove(
														'dragover'
													)
												}
											/>
										</label>
										<div className="inline-btns">
											<button
												className="btn"
												onClick={this.cancelEditImage}
											>
												Cancel
											</button>
											<button
												type="button"
												className="btn btn__danger"
												onClick={this.deleteImage}
											>
												delete
											</button>
											<button className="btn btn__contrast">
												Save
											</button>
										</div>
									</form>
								) : (
									<>
										{isOwner ? (
											<button
												className="btn"
												onClick={() =>
													this.setEdit('picture')
												}
											>
												Edit <FaEdit />
											</button>
										) : null}
									</>
								)}
							</div>

							<div className="profile__content">
								<div className="profile__username">
									{isOwner && username_edit_mode ? (
										<form
											onSubmit={(e) =>
												this.onSubmit(e, 'username')
											}
										>
											{errors.username ? (
												<div className="message-box error">
													{errors.username.map(
														(error, index) => (
															<p
																className="message-box__text"
																key={index}
															>
																{error}
															</p>
														)
													)}
												</div>
											) : null}
											<div className="form-control">
												<input
													type="text"
													name="username"
													className="form-control__input"
													value={username}
													onChange={this.onChange}
												/>
											</div>
											<div className="inline-btns">
												<button
													className="btn"
													onClick={() =>
														this.cancelEdit(
															'username'
														)
													}
												>
													Cancel
												</button>
												<button className="btn btn__contrast">
													Save
												</button>
											</div>
										</form>
									) : (
										<>
											{username}
											{isOwner ? (
												<button
													className="btn__edit"
													onClick={() =>
														this.setEdit('username')
													}
												>
													Edit <FaEdit />
												</button>
											) : null}
										</>
									)}
								</div>
								<div className="profile__bio">
									{isOwner && bio_edit_mode ? (
										<form
											onSubmit={(e) =>
												this.onSubmit(e, 'bio')
											}
										>
											{errors.bio ? (
												<div className="message-box error">
													{errors.bio.map(
														(error, index) => (
															<p
																className="message-box__text"
																key={index}
															>
																{error}
															</p>
														)
													)}
												</div>
											) : null}
											<div className="form-control">
												<Textarea
													name="bio"
													value={bio}
													onChange={this.onChange}
													className="form-control__input form-control__textarea"
													rows="10"
												/>
											</div>
											<div className="inline-btns">
												<button
													className="btn"
													onClick={() =>
														this.cancelEdit('bio')
													}
												>
													Cancel
												</button>
												<button className="btn btn__contrast">
													Save
												</button>
											</div>
										</form>
									) : (
										<>
											{bio
												? bio
												: 'Welcome to my profile!'}
											{isOwner ? (
												<button
													className="btn__edit"
													onClick={() =>
														this.setEdit('bio')
													}
												>
													Edit <FaEdit />
												</button>
											) : null}
										</>
									)}
								</div>
								<p style={{ fontSize: '1.1rem' }}>
									QUIZZES: {quizzes_count}
									&nbsp;&nbsp; &bull; &nbsp;&nbsp; SOLVES:{' '}
									{quizzes_solves}
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
