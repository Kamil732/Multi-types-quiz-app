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
        this.onSubmit = this.onSubmit.bind(this)
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

    onSubmit = e => {
        e.preventDefault()
        const { questions } = this.state

        let answeredQuestions = []

        for (const question of questions) {
            try {
                const answer = document.querySelector(`input[name="answer-${question.id}"]:checked`).value

                answeredQuestions.push({
                    questionId: question.id,
                    answer: answer,
                })
            } catch (err) {
                answeredQuestions.push({
                    questionId: question.id,
                    answer: '',
                })
            }
        //     const answerBtns = document.getElementsByName(`answer-${question.id}`)

        //     for (let i=0; i<answerBtns.length; i++) {
        //         if (answerBtns[i].checked) {
        //             answerBtns[i] =
        //         }
        //     }
        }

        console.table(answeredQuestions)
    }

    render() {
        const { data } = this.props
        const { loading, questions } = this.state

        if (loading === true)
            return <CircleLoader />

        return (
            <>
                <Title title={`Start Quiz - ${data.title}`} />

                <form onSubmit={this.onSubmit}>
                    {
                        data.one_page_questions === true ?
                            <OnePageQuiz
                                questions={questions}
                                section={data.section.name}
                            /> :
                            <MultiPageQuiz
                                questions={questions}
                                section={data.section.name}
                            />
                    }

                    <button className="btn btn__submit btn__contrast">Finish</button>
                </form>
            </>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Start)
