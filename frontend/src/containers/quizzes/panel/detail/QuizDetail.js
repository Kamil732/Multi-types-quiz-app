import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import CircleLoader from '../../../../components/loaders/CircleLoader'
import { connect } from 'react-redux'
import Title from '../../../../common/Title'
import QuizNavigation from '../../../../components/quizzes/panel/QuizNavigation'

import { default as QuizList } from '../List'

class QuizDetail extends Component {
    static propTypes = {
        author_slug: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            data: {},
        }

        this.getQuiz = this.getQuiz.bind(this)
    }

    getQuiz = () => {
        this.setState({ loading: true })
        const { author_slug } = this.props
        const { quiz_slug } = this.props.match.params

        axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/`)
            .then(res =>
                this.setState({
                    loading: false,
                    data: res.data,
                })
            )
            .catch(err =>
                this.setState({
                    loading: false,
                    data: [],
                })
            )
    }

    componentDidMount = () => this.getQuiz()

    componentDidUpdate(prevProps, _) {
        if (prevProps.match.params.quiz_slug !== this.props.match.params.quiz_slug)
            this.getQuiz()
    }

    render() {
        const { loading, data } = this.state

        if (loading)
            return <CircleLoader />
        else if (Object.keys(data).length === 0)
            return <Redirect to="/not-found" />

        return (
            <>
                <Title title={`Dashboard ${data.title}`} />

                <p className="quiz-detail__title">
                    {data.title}
                    <br />
                    <span className="text-darken">created {data.pub_date}</span>
                </p>
                <QuizNavigation quiz_slug={data.slug} />

                <div className="card">
                    <div className="card__body">
                        {/* <div className="card-inline">
                            <img src={data.image_url} className="card-inline__img" alt={data.title} />

                            <div className="card-inline__body">
                                {data.description}
                            </div>
                        </div> */}
                        <QuizList
                            loading={loading}
                            quizzes={[data]}
                        />
                    </div>
                    <hr />

                    <div className="card__body" style={{ textAlign: 'center' }}>
                        <h4>URL address to your quiz:</h4>
                        <br />
                        <Link to={`/quizzes/${this.props.author_slug}/${data.slug}`} style={{ fontSize: '1.1rem' }}>
                            {`${window.location.origin}/quizzes/${this.props.author_slug}/${data.slug}`}
                        </Link>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    author_slug: state.auth.user.slug
})

export default connect(mapStateToProps, null)(QuizDetail)
