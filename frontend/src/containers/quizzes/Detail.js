import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import CircleLoader from '../../components/loaders/CircleLoader'
import Title from '../../common/Title'

import AboutUser from '../../components/accounts/profile/AboutUser'
import FacebookShare from '../../components/social_media/FacebookShare'
import TwitterShare from '../../components/social_media/TwitterShare'
import { Link, Redirect } from 'react-router-dom'

import { getQuiz } from '../../redux/actions/quizzes'

class Detail extends Component {
    static propTypes = {
        user_loading: PropTypes.bool,
        user_slug: PropTypes.string,
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            isOwner: false,
        }

        this.getQuiz = this.getQuiz.bind(this)
    }

    getQuiz = async () => {
        this.setState({ loading: true })
        const { author_slug, quiz_slug } = this.props.match.params

        await this.props.getQuiz(author_slug, quiz_slug)
        this.setState({
            loading: false,
            isOwner: author_slug === this.props.user_slug
        })
    }

    componentDidMount = () => this.getQuiz()

    componentDidUpdate(prevProps, _) {
        if (prevProps.match.params.author_slug !== this.props.match.params.author_slug ||
            prevProps.match.params.quiz_slug !== this.props.match.params.quiz_slug)
            this.getQuiz()
        if (prevProps.user_loading !== this.props.user_loading)
            this.setState({ isOwner: this.props.match.params.author_slug === this.props.user_slug })
    }

    render() {
        const { loading, isOwner } = this.state
        const { data } = this.props

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
                                        <Link to={`/panel/dashboard/${data.slug}/summery`}>
                                            <button className="btn btn__submit">
                                                Edit as an admin
                                            </button>
                                        </Link>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="card__footer">
                            <button className="btn btn__submit btn__contrast">START</button>
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
    data: state.quizzes.quizzes.item
})

const mapDispatchToProps = {
    getQuiz,
}

export default connect(mapStateTopProps, mapDispatchToProps)(Detail)
