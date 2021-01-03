import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { BsFillLockFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

import login_img from '../../../assets/images/login_img.jpg'
import { login } from '../../../redux/actions/auth'
import { clearErrors } from '../../../redux/actions/errors'

class LoginForm extends Component {
    static propTypes = {
        errors: PropTypes.object,
        clearErrors: PropTypes.func.isRequired,
        login: PropTypes.func.isRequired,
    }

    state = {
        email: '',
        password: '',
    }

    componentWillUnmount = () => this.props.clearErrors()

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    onSubmit = e => {
        e.preventDefault()

        this.props.login(this.state.email, this.state.password)
    }

    render() {
        const { email, password } = this.state

        return (
            <>
                <img className="card-inline__img" src={login_img} alt="login" />

                <div className="card-inline__body auth-form">
                    <form onSubmit={this.onSubmit}>
                        {
                            this.props.errors.detail ? (
                                <div className="error-box">
                                    <p className="error-text">{this.props.errors.detail}</p>
                                </div>
                            ) : ''
                        }

                        {
                            this.props.errors.email ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.email.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <div className="icon-form">
                                <span className="icon">
                                    <MdEmail />
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={this.onChange}
                                    className="form-control__input"
                                    placeholder="Email..."
                                    required
                                />
                            </div>
                        </div>

                        {
                            this.props.errors.password ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.password.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <div className="icon-form">
                                <span className="icon">
                                    <BsFillLockFill />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.onChange}
                                    className="form-control__input"
                                    placeholder="Password..."
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn__submit">Sign In</button>
                    </form>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    errors: state.errors.messages,
})

const mapDispatchToProps = {
    login,
    clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
