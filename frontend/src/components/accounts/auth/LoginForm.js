import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { BsFillLockFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

import { login } from '../../../redux/actions/auth'
import { clearErrors } from '../../../redux/actions/errors'

class LoginForm extends Component {
	static propTypes = {
		setLoading: PropTypes.func.isRequired,
		errors: PropTypes.object,
		clearErrors: PropTypes.func.isRequired,
		login: PropTypes.func.isRequired,
	}

	state = {
		email: '',
		password: '',
	}

	componentWillUnmount = () => this.props.clearErrors()

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	onSubmit = (e) => {
		e.preventDefault()

		this.props.setLoading(true)
		this.props.login(this.state.email, this.state.password)
		this.props.setLoading(false)
	}

	render() {
		const { errors } = this.props
		const { email, password } = this.state

		return (
			<form onSubmit={this.onSubmit}>
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
					</div>
				</div>

				<button type="submit" className="btn btn__submit">
					Sign In
				</button>
			</form>
		)
	}
}

const mapStateToProps = (state) => ({
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	login,
	clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
