import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import UserData from '../../components/accounts/profile/UserData'
import Title from '../../common/Title'
import Ad from '../../components/Ad'

class Profile extends Component {
    static propTypes = {
        user: PropTypes.object,
    }

    render() {
        const { picture, username, bio, quizzes_count, quizzes_solves } = this.props.user

        return (
            <>
                <Title title="My Profile" />

                <div className="row">
                    <div className="col-sm-8">
                        <UserData
                            picture_url={picture}
                            username={username}
                            bio={bio}
                            quizzes_count={quizzes_count}
                            quizzes_solves={quizzes_solves}
                        />
                    </div>
                    <div className="col-sm-4">
                        <Ad />
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)