import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import LoginForm from '../../components/accounts/auth/LoginForm'
import RegisterForm from '../../components/accounts/auth/RegisterForm'
import FacebookLogin from 'react-facebook-login'
import axios from 'axios'
import {
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	USER_LOADED,
	USER_LOADING,
} from '../../redux/actions/types'

class Auth extends Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool,
		dispatch: PropTypes.func.isRequired,
	}

	responseFacebook = (data) => {
		const config = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Accept-Language': 'en',
			},
		}

		const body = JSON.stringify({
			provider: 'facebook',
			access_token: data.accessToken,
		})

		axios
			.post(
				`${process.env.REACT_APP_API_URL}/accounts/login/facebook/`,
				body,
				config
			)
			.then((res) => {
				this.props.dispatch({ type: USER_LOADING })
				this.props.dispatch({
					type: LOGIN_SUCCESS,
					payload: {
						access: res.data.token,
						refresh: res.data.refresh,
					},
				})

				this.props.dispatch({
					type: USER_LOADED,
					payload: res.data.user,
				})
			})
			.catch((err) => {
				this.props.dispatch({
					type: LOGIN_FAIL,
				})
			})
	}

	render() {
		if (this.props.isAuthenticated) return <Redirect to="/" />

		let form
		if (this.props.type === 'login') form = <LoginForm />
		else if (this.props.type === 'register') form = <RegisterForm />
		else
			throw Error(
				'Bad Type of Authentication. You must define in props either type="login" or type="register".'
			)

		return (
			<div className="card-inline">
				{form}

				<FacebookLogin
					appId="309943713807869"
					fields="name,first_name"
					callback={this.responseFacebook}
					icon="fa-facebook"
				/>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Auth)
