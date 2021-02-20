import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Title from '../../../../common/Title'
import PrivacyForm from '../../../../components/quizzes/panel/detail/PrivacyForm'

class Privacy extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	}

	render() {
		return (
			<>
				<Title title={`${this.props.data.title} - Privacy`} />

				<div className="card">
					<div className="card__body">
						<PrivacyForm data={this.props.data} />
					</div>
				</div>
			</>
		)
	}
}

export default Privacy
