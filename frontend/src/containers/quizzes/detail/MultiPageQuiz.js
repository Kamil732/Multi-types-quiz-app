import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MultiPageQuiz extends Component {
    static propTypes = {
        questions: PropTypes.array,
        section: PropTypes.string.isRequired,
    }

    render() {
        return (
            <div>
                Multi Page Question
            </div>
        )
    }
}

export default MultiPageQuiz
