import React, { Component } from 'react'
import PropTypes from 'prop-types'

import getAccessToken from '../../../helpers/getAccessToken'
import axios from 'axios'

class AccountSettingsForm extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		errors: PropTypes.object,
		updateUserData: PropTypes.func.isRequired,
		addError: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.initialData = {
			email: props.data.email,
			password: '',
			newPassword: '',
			newPassword2: '',
		}

		this.state = {
			hasChanged: false,
			data: this.initialData,
		}

		this.onChange = this.onChange.bind(this)
		this.cancel = this.cancel.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onChange = (e) =>
		this.setState({
			data: {
				...this.state.data,
				[e.target.name]: e.target.value,
			},
		})

	cancel = () =>
		this.setState({
			hasChanged: false,
			data: this.initialData,
		})

	onSubmit = async (e) => {
		e.preventDefault()

		this.props.clearErrors()
		const token = localStorage.getItem('token')

		try {
			const config = getAccessToken(token, true)

			const res = await axios.patch(
				`${process.env.REACT_APP_API_URL}/accounts/account/update-settings/`,
				this.state.data,
				config
			)

			this.initialData = res.data

			this.setState({
				hasChanged: false,
				data: res.data,
			})

			await this.props.updateUserData({ email: res.data.email })
		} catch (err) {
			if (err.response.status === 401) {
				await this.props.refreshToken()

				if (token) await this.onSubmit(e)
			} else if (err.response)
				this.props.addError(err.response.data, err.response.status)
		}
	}

	componentWillUnmount = () => this.props.clearErrors()

	componentDidUpdate(_, prevState) {
		if (
			JSON.stringify(prevState.data) !== JSON.stringify(this.state.data)
		) {
			const initialData = {
				email: this.initialData.email,
				newPassword: this.initialData.newPassword,
				newPassword2: this.initialData.newPassword2,
			}

			const data = {
				email: this.state.data.email,
				newPassword: this.state.data.newPassword,
				newPassword2: this.state.data.newPassword2,
			}

			this.setState({
				hasChanged:
					JSON.stringify(initialData) !== JSON.stringify(data),
			})
		}
	}

	render() {
		const { errors } = this.props
		const { hasChanged } = this.state
		const { email, password, newPassword, newPassword2 } = this.state.data

		return (
			<form onSubmit={this.onSubmit} className="auth-form">
				{errors.detail ? (
					<div className="message-box error">
						<p className="message-box__text">{errors.detail}</p>
					</div>
				) : null}

				{errors.password ? (
					<div className="message-box error">
						{errors.password.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-inline">
					<label className="form-inline__label" htmlFor="password">
						Current Password:
					</label>
					<input
						id="password"
						type="password"
						name="password"
						value={password}
						onChange={this.onChange}
						className="form-inline__input"
						required
					/>
				</div>

				{errors.email ? (
					<div className="message-box error">
						{errors.email.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-inline">
					<label className="form-inline__label" htmlFor="email">
						Email:
					</label>
					<input
						id="email"
						type="email"
						name="email"
						value={email}
						onChange={this.onChange}
						className="form-inline__input"
						required
					/>
				</div>

				<div className="message-box info" style={{ margin: '20px 0' }}>
					<span className="message-box__text">
						If you want to change password, pass the new one:
					</span>
				</div>

				{errors.newPassword ? (
					<div className="message-box error">
						{errors.newPassword.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-inline">
					<label className="form-inline__label" htmlFor="newPassword">
						New password:
					</label>
					<input
						id="newPassword"
						type="password"
						name="newPassword"
						value={newPassword}
						onChange={this.onChange}
						className="form-inline__input"
					/>
				</div>

				{errors.newPassword2 ? (
					<div className="message-box error">
						{errors.newPassword2.map((error, index) => (
							<p className="message-box__text" key={index}>
								{error}
							</p>
						))}
					</div>
				) : null}
				<div className="form-inline">
					<label
						className="form-inline__label"
						htmlFor="newPassword2"
					>
						Confirm new password:
					</label>
					<input
						id="newPassword2"
						type="password"
						name="newPassword2"
						value={newPassword2}
						onChange={this.onChange}
						className="form-inline__input"
					/>
				</div>

				<div className="inline-btns f-w">
					<button
						type="reset"
						className={`btn ${!hasChanged ? 'btn__disabled' : ''}`}
						onClick={this.cancel}
					>
						Cancel
					</button>
					<button
						type="submit"
						className={`btn btn__contrast ${
							!hasChanged ? 'btn__disabled' : ''
						}`}
					>
						Save
					</button>
				</div>
			</form>
		)
	}
}

/* <small className="help-text">
    <span className="help-text__optional">OPTIONAL</span>
    To start solving your quiz, users will have to pass the
    password. Leave this field empty if you don't want
    require password.
</small> */

export default AccountSettingsForm
