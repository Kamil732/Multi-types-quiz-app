import React from 'react'
import PropTypes from 'prop-types'
import ActiveTag from '../../navigation/ActiveTag'

import { ImHome } from 'react-icons/im'
import { BsDisplayFill } from 'react-icons/bs'
import { IoSettingsSharp } from 'react-icons/io5'
import { MdWidgets } from 'react-icons/md'
import { FaCheckCircle, FaEdit } from 'react-icons/fa'
import { GiPadlock } from 'react-icons/gi'

import Dashboard from '../../../containers/quizzes/panel/Dashboard'
import { Link } from 'react-router-dom'

function DashboardNavigation(props) {
    return (
        <nav className="card horizontal-menu contrast">
            <Link to="/panel/dashboard" className="horizontal-menu__item">
                <span className="icon-text">
                    <ImHome className="icon-text__icon" />
                    Home
                </span>
            </Link>
            <ActiveTag to={[`/panel/dashboard/${props.quiz_slug}`]} className="horizontal-menu__item">
                <span className="icon-text">
                    <BsDisplayFill className="icon-text__icon" />
                    Summery
                </span>
            </ActiveTag>
            <ActiveTag to={[`/panel/dashboard/${props.quiz_slug}/settings`]} className="horizontal-menu__item">
                <span className="icon-text">
                    <IoSettingsSharp className="icon-text__icon" />
                    Settings
                </span>
            </ActiveTag>
            <ActiveTag to={[`/panel/dashboard/${props.quiz_slug}/widget`]} className="horizontal-menu__item">
                <span className="icon-text">
                    <MdWidgets className="icon-text__icon" />
                    Widget
                </span>
            </ActiveTag>
            <ActiveTag to={[`/panel/dashboard/${props.quiz_slug}/privacy`]} className="horizontal-menu__item">
                <span className="icon-text">
                    <GiPadlock className="icon-text__icon" />
                    Privacy
                </span>
            </ActiveTag>
            <ActiveTag to={[`/panel/dashboard/${props.quiz_slug}/punctation`]} className="horizontal-menu__item">
                <span className="icon-text">
                    <FaCheckCircle className="icon-text__icon" />
                    Punctation
                </span>
            </ActiveTag>
            <ActiveTag to={[`/panel/dashboard/${props.quiz_slug}/edit`]} className="horizontal-menu__item">
                <span className="icon-text">
                    <FaEdit className="icon-text__icon" />
                    Edit
                </span>
            </ActiveTag>
        </nav>
    )
}

Dashboard.propTypes = {
    quiz_slug: PropTypes.string.isRequired,
}

export default DashboardNavigation
