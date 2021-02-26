import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import ActiveTag from '../../../navigation/ActiveTag'

import { ImHome } from 'react-icons/im'
import { BsDisplayFill } from 'react-icons/bs'
import { IoSettingsSharp } from 'react-icons/io5'
import { MdWidgets } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { GiPadlock } from 'react-icons/gi'

function Navigation(props) {
	return (
		<nav className="card horizontal-menu contrast">
			<Link to="/panel/dashboard" className="horizontal-menu__item">
				<span className="icon-text">
					<ImHome className="icon-text__icon" />
					Home
				</span>
			</Link>
			<ActiveTag
				to={[`/panel/dashboard/${props.quiz_slug}/summery`]}
				className="horizontal-menu__item"
			>
				<span className="icon-text">
					<BsDisplayFill className="icon-text__icon" />
					Summery
				</span>
			</ActiveTag>
			<ActiveTag
				to={[`/panel/dashboard/${props.quiz_slug}/settings`]}
				className="horizontal-menu__item"
			>
				<span className="icon-text">
					<IoSettingsSharp className="icon-text__icon" />
					Settings
				</span>
			</ActiveTag>
			<ActiveTag
				to={[`/panel/dashboard/${props.quiz_slug}/widget`]}
				className="horizontal-menu__item"
			>
				<span className="icon-text">
					<MdWidgets className="icon-text__icon" />
					Widget
				</span>
			</ActiveTag>
			<ActiveTag
				to={[`/panel/dashboard/${props.quiz_slug}/privacy`]}
				className="horizontal-menu__item"
			>
				<span className="icon-text">
					<GiPadlock className="icon-text__icon" />
					Privacy
				</span>
			</ActiveTag>
			<ActiveTag
				to={[
					`/panel/dashboard/${props.quiz_slug}/edit/punctation`,
					`/panel/dashboard/${props.quiz_slug}/edit/questions`,
				]}
				className="horizontal-menu__item"
			>
				<span className="icon-text">
					<FaEdit className="icon-text__icon" />
					Edit
				</span>
			</ActiveTag>
		</nav>
	)
}

Navigation.propTypes = {
	quiz_slug: PropTypes.string.isRequired,
}

export default Navigation
