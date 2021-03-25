import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addError, clearErrors } from '../../../redux/actions/errors'
import { refreshToken } from '../../../redux/actions/auth'

import AccountSettingsForm from '../../../components/accounts/panel/AccountSettingsForm'
import { USER_UPDATE } from '../../../redux/actions/types'

class AccountSettings extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		errors: PropTypes.object,
		updateUserData: PropTypes.func.isRequired,
		refreshToken: PropTypes.func.isRequired,
		addError: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
	}

	render() {
		return (
			<div className="card">
				<div className="card__header">Account Settings</div>
				<div className="card__body">
					<AccountSettingsForm
						data={this.props.data}
						errors={this.props.errors}
						updateUserData={this.props.updateUserData}
						refreshToken={this.props.refreshToken}
						addError={this.props.addError}
						clearErrors={this.props.clearErrors}
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	data: state.auth.user,
	errors: state.errors.messages,
})

const mapDispatchToProps = (dispatch) => ({
	addError: (data, status) => dispatch(addError(data, status)),
	clearErrors: () => dispatch(clearErrors()),
	refreshToken: () => dispatch(refreshToken()),
	updateUserData: (data) =>
		dispatch({
			type: USER_UPDATE,
			payload: data,
		}),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
