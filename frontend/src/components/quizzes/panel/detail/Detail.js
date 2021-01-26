import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Navigation from './Navigation'
import Routes from './Routes'
import axios from 'axios'
import CircleLoader from '../../../loaders/CircleLoader'
import { Redirect, withRouter } from 'react-router-dom'

class Detail extends Component {
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
        const { quiz_slug } = this.props.match.params

        if (loading === true)
            return <CircleLoader />
        else if (Object.keys(data).length === 0)
            return <Redirect to="/not-found" />

        return (
            <>
                <p className="quiz-detail__title">
                    {data.title}
                    <br />
                    <span className="text-darken">created {data.pub_date}</span>
                </p>
                <Navigation quiz_slug={quiz_slug} />

                <Routes data={data} />
            </>
        )
    }
}

const mapStateToProps = state => ({
    author_slug: state.auth.user.slug,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detail))
