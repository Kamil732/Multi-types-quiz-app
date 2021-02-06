import React, { Component } from 'react'
import PropTypes from 'prop-types'

class KnowledgeAnswers extends Component {
	static propTypes = {
		answers: PropTypes.array,
		questionId: PropTypes.number.isRequired,
		finished: PropTypes.bool,
	}

	constructor(props) {
		super(props)
		const { questionId } = this.props

		this.state = {
			[`answer-${questionId}`]: '',
		}

		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => this.setState({ [e.target.name]: e.target.value })

	render() {
		const { answers, questionId, finished } = this.props
		const answer = this.state[`answer-${questionId}`]

		const answerList = answers.map((answer_, index) => (
			<label
				className={`card card__body answer ${
					answer === answer_.slug ? 'active' : ''
				}`}
				key={index}
			>
				<input
					type="radio"
					name={`answer-${questionId}`}
					value={answer_.slug}
					onChange={this.onChange}
					checked={answer === answer_.slug}
					disabled={finished}
				/>

				{answer_.answer}
			</label>
		))

		return answerList
	}
}

export default KnowledgeAnswers
