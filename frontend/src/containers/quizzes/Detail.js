import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes, { bool } from 'prop-types'
import axios from 'axios'
import CircleLoader from '../../components/loaders/CircleLoader'
import Title from '../../common/Title'

import { FaEdit } from 'react-icons/fa'

import AboutUser from '../../components/accounts/profile/AboutUser'
import FacebookShare from '../../components/social_media/FacebookShare'
import TwitterShare from '../../components/social_media/TwitterShare'
import { Link, Redirect } from 'react-router-dom'

class Detail extends Component {
    static propTypes = {
        user_loading: PropTypes.bool,
        user_slug_slug: PropTypes.string,
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            isOwner: false,
            data: {},
        }

        this.getQuizData = this.getQuizData.bind(this)
    }

    getQuizData() {
        const { author_slug, quiz_slug } = this.props.match.params

        if (this.props.user_loading === false)
            axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/`)
                .then(res =>
                    this.setState({
                        loading: false,
                        isOwner: author_slug === this.props.user_slug,
                        data: res.data,
                    })
                )
                .catch(err =>
                    this.setState({
                        loading: false,
                        isOwner: false,
                        data: [],
                    })
                )
    }

    componentDidMount = () => this.getQuizData()

    componentDidUpdate(prevProps, _) {
        if (prevProps.match.params.author_slug !== this.props.match.params.author_slug ||
            prevProps.match.params.quiz_slug !== this.props.match.params.quiz_slug ||
            prevProps.user_loading !== this.props.user_loading)
            this.getQuizData()
    }

    render() {
        const { loading, isOwner, data } = this.state

        if (loading)
            return <CircleLoader />
        else if (Object.keys(data).length === 0)
            return <Redirect to="/not-found" />

        return (
            <>
                <Title title={`Quiz Detail ${data.title}`} />

                <div className="row">
                    <div className="col col-sm-9">
                        <div className="card__header">
                            {data.title}
                        </div>
                        <div className="card">
                            <div className="card__body">
                                <div className="quiz-detail">
                                    <img className="quiz-detail__img" src={data.image_url} alt={data.title} />
                                    <span style={{ wordWrap: 'break-word' }}>
                                        {data.description}
                                    </span>
                                </div>
                            </div>

                            <hr />

                            <div className="card__body share-items">
                                <FacebookShare url={window.location.href} quote={data.title} image_url={data.image_url} />
                                <TwitterShare url={window.location.href} title={data.title} />
                            </div>
                            {
                                isOwner ? (
                                    <div className="card__footer">
                                        <Link to={`/panel/dashboard/${data.slug}`} className="btn icon-text" style={{ width: 'fit-content' }}>
                                            <FaEdit className="icon-text__icon" />
                                            Edit as an admin
                                        </Link>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="card__footer">
                            <button className="btn btn__submit btn__contrast" style={{ display: 'block', margin: '0 auto' }}>START</button>
                        </div>
                    </div>
                    <div className="col col-sm-3">
                        <AboutUser
                            accountUrl={data.author}
                        />
                    </div>
                </div>
            </>
        )
    }
}

const mapStateTopProps = state => ({
    user_loading: state.auth.loading,
    user_slug: state.auth.user.slug,
})

export default connect(mapStateTopProps, null)(Detail)
