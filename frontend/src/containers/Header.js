import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'
import { default as NavigationMenu } from '../components/navigation/Menu'
import DarkModeToggle from '../components/DarkModeToggle'

class Header extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isNavigationOpend: null,
		}

		this.toggleNavigation = this.toggleNavigation.bind(this)
	}

	toggleNavigation = () =>
		this.setState({ isNavigationOpend: !this.state.isNavigationOpend })

	render() {
		const { isNavigationOpend } = this.state

		document.body.style.overflow = isNavigationOpend ? 'hidden' : 'auto'

		return (
			<header className="site-header">
				<div className="mobile-nav">
					<Link to="/" className="logo__link">
						<img
							src={logo}
							alt="quizziz"
							width="150"
							height="30"
							className="logo__img"
						></img>
					</Link>
					<DarkModeToggle />
					<div className="nav-btn" onClick={this.toggleNavigation}>
						<span className="nav-btn__burger"></span>
					</div>
				</div>

				{isNavigationOpend ? (
					<div
						className="nav-background"
						onClick={this.toggleNavigation}
					></div>
				) : null}

				<nav className={`nav ${isNavigationOpend ? 'opened' : ''}`}>
					<NavigationMenu
						closeNavigation={() =>
							this.setState({ isNavigationOpend: false })
						}
					/>
				</nav>
			</header>
		)
	}
}

export default Header
