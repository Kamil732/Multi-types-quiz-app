import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addError, clearErrors } from '../../../redux/actions/errors'
import { updateUserData } from '../../../redux/actions/auth'

import AccountSettingsForm from '../../../components/accounts/panel/AccountSettingsForm'

class AccountSettings extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		errors: PropTypes.object,
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

const mapDispatchToProps = {
	addError,
	clearErrors,
	updateUserData,
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
