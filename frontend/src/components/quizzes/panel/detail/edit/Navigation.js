import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ActiveTag from '../../../../navigation/ActiveTag'

class Navigation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	}

	render() {
		const { data } = this.props

		return (
			<nav className="card horizontal-menu contrast">
				<ActiveTag
					to={[`/panel/dashboard/${data.slug}/edit/questions`]}
					className="horizontal-menu__item"
				>
					Questions
				</ActiveTag>
			</nav>
		)
	}
}

export default Navigation
