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
import { getQuizzes } from '../../redux/actions/quizzes'
import Quizzes from '../quizzes/Quizzes'

class Profile extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool,
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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.profile_slug !== this.props.match.params.profile_slug ||
            prevProps.userLoading !== this.props.userLoading)
            this.getProfileData()

        if (prevProps.isAuthenticated !== this.props.isAuthenticated && this.state.isOwner === true)
            this.setState({ isOwner: false })

        else if (this.state.isOwner === true && prevProps.user !== this.props.user)
            this.setState({ data: this.props.user })
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
                            picture={data.picture}
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
                <Quizzes
                    title="Most Popular Quizzes"
                    searchUrl="http://192.168.1.31:8000/api/accounts/current/quizzes/"
                    getQuizzes={this.props.getQuizzes}
                    loading={this.props.quizzes.loading}
                    quizzes={this.props.quizzes.data}
                />
            </>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userLoading: state.auth.loading,
    user: state.auth.user,
    quizzes: state.quizzes.quizzes,
    errors: state.errors.messages,
})

const mapDispatchToProps = {
    updateUserData,
    removeError,
    clearErrors,
    getQuizzes,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))