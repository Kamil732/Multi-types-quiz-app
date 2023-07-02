import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FaUserAlt } from 'react-icons/fa'
import { BsFillLockFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

import { signUp } from '../../../redux/actions/auth'
import { clearErrors } from '../../../redux/actions/errors'

import CSRFToken from '../../CSRFToken'

class RegisterForm extends Component {
	static propTypes = {
		setLoading: PropTypes.func.isRequired,
		signUp: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
		isAuthenticated: PropTypes.bool,
		errors: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.state = {
			email: '',
			username: '',
			password: '',
			password2: '',
		}

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = async (e) => {
		e.preventDefault()
		this.props.setLoading(true)

		// window.grecaptcha.ready(() => {
		// 	window.grecaptcha
		// 		.execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, {
		// 			action: 'submit',
		// 		})
		// 		.then((token) => {
		// 			this.props.signUp(token, this.state)
		// 			this.props.setLoading(false)
		// 		})
		// })

		await this.props.signUp(null, this.state)
		this.props.setLoading(false)
	}

	render() {
		const { errors } = this.props
		const { email, username, password, password2 } = this.state

		return (
			<form onSubmit={this.onSubmit}>
				<CSRFToken />

				{errors.error ? (
					<div className="message-box error">
						<p className="message-box__text">{errors.error}</p>
					</div>
				) : null}
				{errors.detail ? (
					<div className="message-box error">
						<p className="message-box__text">{errors.detail}</p>
					</div>
				) : null}

				{errors.email ? (
					<div className="message-box error">
						{errors.email.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-control">
					<div className="icon-form">
						<span className="icon">
							<MdEmail />
						</span>
						<input
							type="email"
							name="email"
							value={email}
							onChange={this.onChange}
							className="form-control__input"
							placeholder="Email..."
							required
							maxLength="80"
						/>
					</div>
				</div>

				{errors.username ? (
					<div className="message-box error">
						{errors.username.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-control">
					<div className="icon-form">
						<span className="icon">
							<FaUserAlt />
						</span>
						<input
							type="text"
							name="username"
							value={username}
							onChange={this.onChange}
							className="form-control__input"
							placeholder="Username..."
							required
							maxLength="20"
						/>
					</div>
				</div>

				{errors.password ? (
					<div className="message-box error">
						{errors.password.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				{errors.password2 ? (
					<div className="message-box error">
						{errors.password2.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-control">
					<div className="icon-form">
						<span className="icon">
							<BsFillLockFill />
						</span>
						<input
							type="password"
							name="password"
							value={password}
							onChange={this.onChange}
							className="form-control__input"
							placeholder="Password..."
							required
						/>
						<input
							type="password"
							name="password2"
							value={password2}
							onChange={this.onChange}
							className="form-control__input"
							placeholder="Confirm Password..."
							required
						/>
					</div>
				</div>

				<button type="submit" className="btn btn__submit">
					Sign Up
				</button>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	signUp,
	clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
