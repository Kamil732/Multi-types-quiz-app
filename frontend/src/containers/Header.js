import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'
import { default as NavigationMenu } from '../components/navigation/Menu'

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isNavigationOpend: null,
        }

        this.toggleNavigation = this.toggleNavigation.bind(this)
    }

    toggleNavigation = () => {
        this.setState({
            ...this.state,
            isNavigationOpend: !this.state.isNavigationOpend,
        })
    }

    render() {
        const { isNavigationOpend } = this.state

        return (
            <header className="site-header">
                <div className="mobile-nav">
                    <Link to="/" className="logo__link">
                        <img src={logo} alt="quizziz" width="225" height="350" className="logo__img"></img>
                    </Link>
                    <div className="nav-btn" onClick={this.toggleNavigation}>
                        <span className="nav-btn__burger"></span>
                    </div>
                </div>

                {
                    isNavigationOpend ? (
                        <div className="nav-background" onClick={this.toggleNavigation}></div>
                    ) : ""
                }

                <nav className={`nav ${isNavigationOpend ? 'opened' : ''}`}>
                    <NavigationMenu closeNavigation={() => this.setState({ isNavigationOpend: false })} />
                </nav>
            </header>
        )
    }
}

export default Header
