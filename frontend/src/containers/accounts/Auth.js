import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoginForm from '../../components/accounts/auth/LoginForm'
import RegisterForm from '../../components/accounts/auth/RegisterForm'

class Auth extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        isAuthenticated: PropTypes.bool,
    }

    render() {
        if(this.props.isAuthenticated) return <Redirect to="/" />

        let form
        if (this.props.type === 'login') form = <LoginForm />
        else if (this.props.type === 'register') form = <RegisterForm />
        else throw Error('Bad Type of Authentication. You must define in props either type="login" or type="register".')

        return (
            <div className="card-inline">
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Auth)
