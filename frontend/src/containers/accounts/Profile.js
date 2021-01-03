import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect, withRouter } from 'react-router-dom'

import UserData from '../../components/accounts/profile/UserData'

class Profile extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
    }

    render() {
        if (this.props.isAuthenticated === false) return <Redirect to="/" />
        const { picture, username, email } = this.props.user

        return (
            <div className="row">
                <div className="col-sm-8">
                    <UserData
                        picture_url={picture}
                        username={username}
                        email={email}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))