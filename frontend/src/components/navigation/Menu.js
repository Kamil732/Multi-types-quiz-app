import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { logout } from '../../redux/actions/auth'
import ActiveTag from './ActiveTag'

import { FaUserAlt, FaPlusCircle } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'

class Menu extends Component {
	static propTypes = {
		isNavigationOpened: PropTypes.bool,
		username: PropTypes.string,
		slug: PropTypes.string,
		loading: PropTypes.bool,
		logout: PropTypes.func.isRequired,
	}

	render() {
		if (this.props.loading === true) return <></>

		const auth_links = this.props.username ? (
			<>
				<ActiveTag
					to={['/panel/create-quiz']}
					tag="li"
					className="menu-nav__item"
				>
					<Link
						to="/panel/create-quiz"
						className="menu-nav__link icon-text"
						onClick={this.props.closeNavigation}
					>
						<FaPlusCircle className="icon-text__icon" />
						Create Quiz
					</Link>
				</ActiveTag>
				<ActiveTag
					to={['/panel/dashboard']}
					tag="li"
					className="menu-nav__item"
				>
					<Link
						to="/panel/dashboard"
						className="menu-nav__link icon-text"
						onClick={this.props.closeNavigation}
					>
						<MdDashboard className="icon-text__icon" />
						Panel
					</Link>
				</ActiveTag>
				<ActiveTag
					to={[
						`/profile/${this.props.slug}`,
						'/panel/account-settings',
					]}
					tag="li"
					className="menu-nav__item dropdown"
				>
					<button className="menu-nav__link dropdown__btn icon-text">
						<FaUserAlt className="icon-text__icon" />
						{this.props.username}
					</button>

					<div className="dropdown__menu">
						<ActiveTag
							to={[`/profile/${this.props.slug}`]}
							className="dropdown__menu__link"
							jsx={{ onClick: this.props.closeNavigation }}
						>
							My Profile
						</ActiveTag>
						<ActiveTag
							to={['/panel/account-settings']}
							className="dropdown__menu__link"
							jsx={{ onClick: this.props.closeNavigation }}
						>
							Settings
						</ActiveTag>
						<hr style={{ margin: '20px 0' }} />
						<button
							className="dropdown__menu__link btn"
							onClick={() => {
								this.props.logout()
								this.props.closeNavigation()
							}}
						>
							Logout
						</button>
					</div>
				</ActiveTag>
			</>
		) : (
			<>
				<ActiveTag to={['/login']} tag="li" className="menu-nav__item">
					<Link
						to="/login"
						className="menu-nav__link"
						onClick={this.props.closeNavigation}
					>
						Login
					</Link>
				</ActiveTag>
				<ActiveTag
					to={['/register']}
					tag="li"
					className="menu-nav__item"
				>
					<Link
						to="/register"
						className="menu-nav__link"
						onClick={this.props.closeNavigation}
					>
						Register
					</Link>
				</ActiveTag>
			</>
		)

		return <ul className="menu-nav">{auth_links}</ul>
	}
}

const mapStateToProps = (state) => ({
	username: state.auth.user.username,
	slug: state.auth.user.slug,
	loading: state.auth.loading,
})

const mapDispatchToProps = {
	logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
