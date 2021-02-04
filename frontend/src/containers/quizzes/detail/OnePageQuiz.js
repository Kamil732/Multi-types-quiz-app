import React, { Component } from 'react'
import PropTypes from 'prop-types'

class OnePageQuiz extends Component {
    static propTypes = {
        questions: PropTypes.array,
    }

    render() {
        const { questions } = this.props

        const questionList = questions.map((question, index) => (
            <div className="card" key={index}>
                <div className="card__header">{question.question}</div>
                <div className="card__body">
                    {question.answers}
                </div>
            </div>
        ))

        return questionList
    }
}

export default OnePageQuiz
