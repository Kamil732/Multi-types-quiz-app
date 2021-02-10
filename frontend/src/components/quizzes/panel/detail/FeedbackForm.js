import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import axios from 'axios'
import { clearErrors, addError } from '../../../../redux/actions/errors'

import Textarea from '../../../Textarea'

class FeedbackForm extends Component {
	static propTypes = {
		ask_name: PropTypes.bool,
		ask_email: PropTypes.bool,
		ask_gender: PropTypes.bool,
		ask_opinion: PropTypes.bool,
		author_slug: PropTypes.string.isRequired,
		quiz_slug: PropTypes.string.isRequired,
		callback: PropTypes.func,
		errors: PropTypes.object,
		clearErrors: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			name: '',
			email: '',
			gender: '',
			ask_opinion: '',
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = (e) => {
		e.preventDefault()
		const { author_slug, quiz_slug, callback } = this.props
		const { name, email, gender, opinion } = this.state

		const config = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Accept-Language': 'en',
			},
		}

		const body = JSON.stringify({ name, email, gender, opinion })

		axios
			.post(
				`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/feedback/`,
				body,
				config
			)
			.then(() => callback())
			.catch((err) => {
				if (err.response)
					this.props.addError(err.response.data, err.response.status)
			})
	}

	render() {
		const {
			ask_name,
			ask_email,
			ask_gender,
			ask_opinion,
			errors,
		} = this.props
		const { name, email, gender, opinion } = this.state

		return (
			<form onSubmit={this.onSubmit} className="auth-form">
				{errors.detail ? (
					<div className="message-box error">
						<p className="message-box__text">{errors.detail}</p>
					</div>
				) : null}

				{ask_name ? (
					<>
						{errors.name ? (
							<div className="message-box error">
								{errors.name.map((error, index) => (
									<p
										className="message-box__text"
										key={index}
									>
										{error}
									</p>
								))}
							</div>
						) : null}

						<div className="form-inline">
							<label
								htmlFor="name"
								className="form-inline__label"
							>
								Name:
							</label>
							<input
								type="text"
								id="name"
								name="name"
								className="form-inline__input"
								onChange={this.onChange}
								value={name}
								required
							/>
						</div>
					</>
				) : null}

				{ask_email ? (
					<>
						{errors.email ? (
							<div className="message-box error">
								{errors.email.map((error, index) => (
									<p
										className="message-box__text"
										key={index}
									>
										{error}
									</p>
								))}
							</div>
						) : null}

						<div className="form-inline">
							<label
								htmlFor="email"
								className="form-inline__label"
							>
								Email:
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="form-inline__input"
								onChange={this.onChange}
								value={email}
								required
							/>
						</div>
					</>
				) : null}

				{ask_gender ? (
					<>
						{errors.gender ? (
							<div className="message-box error">
								{errors.gender.map((error, index) => (
									<p
										className="message-box__text"
										key={index}
									>
										{error}
									</p>
								))}
							</div>
						) : null}

						<div className="form-inline">
							<label
								htmlFor="gender"
								className="form-inline__label"
							>
								Gender:
							</label>

							<div className="switch-btn" id="gender">
								<input
									type="radio"
									id="gender__woman"
									name="gender"
									value="woman"
									onChange={this.onChange}
									checked={gender === 'woman'}
									required
								/>
								<label htmlFor="gender__woman">Woman</label>

								<input
									type="radio"
									id="gender__man"
									name="gender"
									value="man"
									onChange={this.onChange}
									checked={gender === 'man'}
									required
								/>
								<label htmlFor="gender__man">Man</label>
							</div>
						</div>
					</>
				) : null}

				{ask_opinion ? (
					<>
						{errors.opinion ? (
							<div className="message-box error">
								{errors.opinion.map((error, index) => (
									<p
										className="message-box__text"
										key={index}
									>
										{error}
									</p>
								))}
							</div>
						) : null}

						<div className="form-inline">
							<label
								htmlFor="opinion"
								className="form-inline__label"
							>
								Opinion:
							</label>
							<Textarea
								id="opinion"
								name="opinion"
								className="form-inline__input"
								onChange={this.onChange}
								value={opinion}
							/>
						</div>
					</>
				) : null}

				<button className="btn btn__submit">Send Feedback</button>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	clearErrors,
	addError,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(FeedbackForm))
