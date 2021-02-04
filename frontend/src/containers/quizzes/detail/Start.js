import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Title from '../../../common/Title'
import axios from 'axios'
import CircleLoader from '../../../components/loaders/CircleLoader'
import OnePageQuiz from './OnePageQuiz'
import MultiPageQuiz from './MultiPageQuiz'

class Start extends Component {
    static propTypes = {
        author_slug: PropTypes.string.isRequired,
        isOwner: PropTypes.bool,
        data: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            questions: [],
        }

        this.getQuestions = this.getQuestions.bind(this)
    }

    getQuestions = () => {
        this.setState({ loading: true })
        const { data } = this.props

        axios.get(data.questions)
            .then(res =>
                this.setState({
                    loading: false,
                    questions: res.data,
                })
            )
            .catch(err =>
                this.setState({
                    loading: false,
                    questions: [],
                })
            )
    }

    componentDidMount = () => this.getQuestions()

    componentDidUpdate(prevProps, _) {
        if (prevProps.data !== this.props.data)
            this.getQuestions()
    }

    render() {
        const { data } = this.props
        const { loading, questions } = this.state

        if (loading === true)
            return <CircleLoader />

        return (
            <>
                <Title title={`Start Quiz - ${data.title}`} />

                {
                    data.one_page_questions === true ?
                        <OnePageQuiz
                            questions={questions}
                        /> :
                        <MultiPageQuiz
                            questions={questions}
                        />
                }
            </>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Start)
