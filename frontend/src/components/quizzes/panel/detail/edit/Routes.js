import React, { Component } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import PrivateRoute from '../../../../../common/PrivateRoute'

import Navigation from './Navigation'
import EditQuestions from '../../../../../containers/quizzes/panel/detail/edit/EditQuestions'

class Routes extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	}

	render() {
		return (
			<>
				<br />
				<Navigation data={this.props.data} />

				<Switch>
					<PrivateRoute
						exact
						path="/panel/dashboard/:quiz_slug/edit/questions"
						component={() => <EditQuestions {...this.props} />}
					/>

					<Redirect to="/not-found" />
				</Switch>
			</>
		)
	}
}

export default Routes
