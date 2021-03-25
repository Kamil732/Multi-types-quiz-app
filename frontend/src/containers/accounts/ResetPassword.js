import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { clearErrors, addError } from '../../redux/actions/errors'
import { login } from '../../redux/actions/auth'
import axios from 'axios'

import CircleLoader from '../../components/loaders/CircleLoader'
import { Redirect } from 'react-router'

class ResetPassword extends Component {
	static propTypes = {
		errors: PropTypes.object,
		isAuthenticated: PropTypes.bool,
		login: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
		addError: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			email: '',
			password1: '',
			password2: '',
			sent: false,
			token: null,
		}

		this.sendEmail = this.sendEmail.bind(this)
		this.changePassword = this.changePassword.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	sendEmail = async (e) => {
		e.preventDefault()

		this.props.clearErrors()
		this.setState({ loading: true })

		try {
			const config = {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Accept-Language': 'en',
				},
			}

			const body = JSON.stringify({ email: this.state.email })

			await axios.post(
				`${process.env.REACT_APP_API_URL}/accounts/current/update-settings/password-reset/`,
				body,
				config
			)

			this.setState({
				sent: true,
				loading: false,
			})
		} catch (err) {
			this.setState({ loading: false })
			if (err.response)
				this.props.addError(err.response.data, err.response.status)
		}
	}

	changePassword = async (e) => {
		e.preventDefault()
		const { sent, email, token, password1, password2 } = this.state

		if (sent) {
			this.props.clearErrors()
			this.setState({ loading: true })

			if (password1 !== password2)
				this.props.addError({ detail: 'Passwords do not match' }, 400)

			try {
				const config = {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'Accept-Language': 'en',
					},
				}

				const body = JSON.stringify({
					token,
					password: password2,
				})

				await axios.post(
					`${process.env.REACT_APP_API_URL}/accounts/current/update-settings/password-reset/confirm/`,
					body,
					config
				)

				this.props.login(email, password2)
			} catch (err) {
				this.setState({ loading: false })
				if (err.response)
					this.props.addError(err.response.data, err.response.status)
			}
		}
	}

	render() {
		const { errors, isAuthenticated } = this.props
		const { email, password1, password2, token, sent, loading } = this.state

		if (isAuthenticated) return <Redirect to="/" />

		if (loading)
			return (
				<div className="card" style={{ margin: 'auto' }}>
					<div className="card__header">Reset Your Password</div>
					<div className="card__body">
						<CircleLoader />
					</div>
				</div>
			)

		return (
			<div className="card" style={{ margin: 'auto' }}>
				<div className="card__header">Reset Your Password</div>
				<div className="card__body">
					{errors.status ? (
						<div className="message-box error">
							<p className="message-box__text">
								Something went wrong. The token might be expired
								or incorrect
							</p>
						</div>
					) : null}
					{!sent ? (
						<form onSubmit={this.sendEmail} className="auth-form">
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
								<label className="form-inline__label">
									Email:
								</label>
								<input
									type="email"
									name="email"
									value={email}
									onChange={this.onChange}
									className="form-inline__input"
									placeholder="Your email..."
									required
								/>
							</div>

							<button type="submit" className="btn">
								Send Me Email
							</button>
						</form>
					) : (
						<form
							onSubmit={this.changePassword}
							className="auth-form"
						>
							{errors.token ? (
								<div className="message-box error">
									{errors.token.map((error, index) => (
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
								<label className="form-inline__label">
									Token:
								</label>
								<input
									type="text"
									name="token"
									value={token}
									onChange={this.onChange}
									className="form-inline__input"
									placeholder="Token from sent email..."
									required
								/>
							</div>

							{errors.password ? (
								<div className="message-box error">
									{errors.password.map((error, index) => (
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
								<label className="form-inline__label">
									New password:
								</label>
								<input
									type="password"
									name="password1"
									value={password1}
									onChange={this.onChange}
									className="form-inline__input"
									placeholder="New password..."
									required
								/>
							</div>

							<div className="form-inline">
								<label className="form-inline__label">
									Confirm new password:
								</label>
								<input
									type="password"
									name="password2"
									value={password2}
									onChange={this.onChange}
									className="form-inline__input"
									placeholder="Confirm new password..."
									required
								/>
							</div>

							<button type="submit" className="btn btn__contrast">
								Save
							</button>
							<div
								style={{
									marginTop: '10px',
								}}
								className="auth-form"
							>
								<p>Did not recive the token?</p>
								<button
									type="button"
									className="btn"
									onClick={this.sendEmail}
								>
									Send email again
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	login,
	clearErrors,
	addError,
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
