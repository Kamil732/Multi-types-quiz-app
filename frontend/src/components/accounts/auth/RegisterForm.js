import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { FaUserAlt } from 'react-icons/fa'
import { BsFillLockFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

import register_img from '../../../assets/images/register_img.jpg'
import { signUp } from '../../../redux/actions/auth'
import { clearErrors } from '../../../redux/actions/errors'

class RegisterForm extends Component {
    static propTypes = {
        signUp: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        errors: PropTypes.object,
    }

    state = {
        email: '',
        username: '',
        password: '',
        password2: '',
    }

    componentWillUnmount = () => this.props.clearErrors()

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    onSubmit = e => {
        e.preventDefault()

        this.props.signUp(this.state)
    }

    render() {
        const { email, username, password, password2 } = this.state

        return (
            <>
                <img className="card-inline__img" src={register_img} alt="register" />

                <div className="card-inline__body container auth-form">
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
                                    maxLength="80"
                                />
                            </div>
                        </div>

                        {
                            this.props.errors.username ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.username.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <div className="icon-form">
                                <span className="icon">
                                    <FaUserAlt />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={this.onChange}
                                    className="form-control__input"
                                    placeholder="Username..."
                                    required
                                    maxLength="20"
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
                        {
                            this.props.errors.password2 ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.password2.map((error, index) => (
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
                                <hr />
                                <input
                                    type="password"
                                    name="password2"
                                    value={password2}
                                    onChange={this.onChange}
                                    className="form-control__input"
                                    placeholder="Confirm Password..."
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn__submit">Sign Up</button>
                    </form>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.errors.messages,
})


const mapDispatchToProps = {
    signUp,
    clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
