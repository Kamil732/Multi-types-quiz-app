import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import UserData from '../../components/accounts/profile/UserData'
import Title from '../../common/Title'
import Ad from '../../components/Ad'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import CircleLoader from '../../components/loaders/CircleLoader'
import NotFound from '../errors/NotFound'

import { updateUserData } from '../../redux/actions/auth'
import { removeError, clearErrors } from '../../redux/actions/errors'

class Profile extends Component {
    static propTypes = {
        userLoading: PropTypes.bool,
        user: PropTypes.object,
        errors: PropTypes.object,
        removeError: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        updateUserData: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            isOwner: false,
            data: {},
        }

        this.getProfileData = this.getProfileData.bind(this)
    }

    getProfileData() {
        this.setState({ loading: true })
        const { userLoading, user } = this.props
        const { profile_slug } = this.props.match.params

        if (userLoading === false) {
            if (profile_slug === user.slug)
                this.setState({
                    loading: false,
                    isOwner: true,
                    data: user,
                })
            else {
                axios.get(`${process.env.REACT_APP_API_URL}/accounts/account/${profile_slug}/`)
                    .then(res =>
                        this.setState({
                            loading: false,
                            isOwner: false,
                            data: res.data,
                        })
                    )
                    .catch(err =>
                        this.setState({
                            loading: false,
                            isOwner: false,
                            data: {},
                        })
                    )
            }
        }
    }

    componentDidMount = () => this.getProfileData()

    componentWillUnmount = () => this.props.clearErrors()

    componentDidUpdate(prevProps, _) {
        if (prevProps.userLoading !== this.props.userLoading || prevProps.match.params.profile_slug !== this.props.match.params.profile_slug)
            this.getProfileData()
    }

    render() {
        const { loading, isOwner, data } = this.state

        if (loading === true)
            return <CircleLoader />
        else if (Object.keys(data).length === 0)
            return <NotFound />

        return (
            <>
                <Title title={`${data.username} Profile`} />

                <div className="row">
                    <div className="col col-sm-8">
                        <UserData
                            isOwner={isOwner}
                            picture_url={data.picture}
                            username={data.username}
                            bio={data.bio}
                            quizzes_count={data.quizzes_count}
                            quizzes_solves={data.quizzes_solves}
                            errors={this.props.errors}
                            removeError={this.props.removeError}
                            updateUserData={this.props.updateUserData}
                        />
                    </div>
                    <div className="col col-sm-4">
                        <Ad />
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    userLoading: state.auth.loading,
    user: state.auth.user,
    errors: state.errors.messages,
})

const mapDispatchToProps = {
    updateUserData,
    removeError,
    clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))