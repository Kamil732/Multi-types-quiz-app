import React, { Component } from 'react'
import PropTypes from 'prop-types'

class UniversalAnswers extends Component {
    static propTypes = {
        answers: PropTypes.array,
        questionId: PropTypes.number.isRequired,
    }

    render() {
        const { answers } = this.props

        return answers.map((answer, index) => (
            <div className="card" key={index}>
                {answer.answer}
            </div>
        ))
    }
}

export default UniversalAnswers