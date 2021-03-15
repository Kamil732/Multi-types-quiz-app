import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import login_img from '../../assets/images/login_img.jpg'
import register_img from '../../assets/images/register_img.jpg'

import LoginForm from '../../components/accounts/auth/LoginForm'
import RegisterForm from '../../components/accounts/auth/RegisterForm'
import FacebookLogin from 'react-facebook-login'
import axios from 'axios'
import {
	ADD_ERROR,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	USER_LOADED,
	USER_LOADING,
} from '../../redux/actions/types'
import Title from '../../common/Title'

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

				if (err.response)
					this.props.dispatch({
						type: ADD_ERROR,
						payload: {
							messages: err.response.data,
							status: err.response.status,
						},
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
				{this.props.type === 'login' ? (
					<>
						<Title title="Login" />
						<img
							className="card-inline__img"
							src={login_img}
							alt="login"
						/>
					</>
				) : (
					<>
						<Title title="Sign up" />
						<img
							className="card-inline__img"
							src={register_img}
							alt="register"
						/>
					</>
				)}

				<div className="card-inline__body auth-form">
					{form}

					<div className="separator">or</div>
					<FacebookLogin
						appId={process.env.REACT_APP_FACEBOOK_ID}
						fields="email,first_name"
						callback={this.responseFacebook}
						icon="fa-facebook"
						textButton="&nbsp;&nbsp;Log In with Facebook"
						cssClass="btnFacebook"
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Auth)
