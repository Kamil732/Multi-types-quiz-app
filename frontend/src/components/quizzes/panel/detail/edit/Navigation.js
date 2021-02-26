import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ActiveTag from '../../../../navigation/ActiveTag'

import { FaCheckCircle } from 'react-icons/fa'
import { BsQuestionCircleFill } from 'react-icons/bs'

class Navigation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	}

	render() {
		const { data } = this.props

		return (
			<nav className="card horizontal-menu contrast">
				<ActiveTag
					to={[`/panel/dashboard/${data.slug}/edit/punctation`]}
					className="horizontal-menu__item"
				>
					<span className="icon-text">
						<FaCheckCircle className="icon-text__icon" />
						Punctation
					</span>
				</ActiveTag>
				<ActiveTag
					to={[`/panel/dashboard/${data.slug}/edit/questions`]}
					className="horizontal-menu__item"
				>
					<span className="icon-text">
						<BsQuestionCircleFill className="icon-text__icon" />
						Questions
					</span>
				</ActiveTag>
			</nav>
		)
	}
}

export default Navigation
