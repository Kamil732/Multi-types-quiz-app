import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, withRouter } from 'react-router-dom'
import axios from 'axios'
import CircleLoader from '../../../components/loaders/CircleLoader'
import { connect } from 'react-redux'
import Title from '../../../common/Title'
import QuizNavigation from '../../../components/quizzes/panel/QuizNavigation'

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
                <QuizNavigation quiz_slug={data.slug} />

                {data.title}
            </>
        )
    }
}

const mapStateToProps = state => ({
    author_slug: state.auth.user.slug
})

export default connect(mapStateToProps, null)(withRouter(QuizDetail))
