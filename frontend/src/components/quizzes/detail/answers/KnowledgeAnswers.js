import React, { Component } from 'react'
import PropTypes from 'prop-types'

class KnowledgeAnswers extends Component {
	static propTypes = {
		questionNumber: PropTypes.number.isRequired,
		answers: PropTypes.array,
		questionId: PropTypes.number.isRequired,
		finishedData: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.state = {
			answer: '',
		}

		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => this.setState({ answer: e.target.value })

	render() {
		const { questionNumber, answers, questionId, finishedData } = this.props
		const { answer } = this.state

		const answerList = answers.map((answer_, index) => {
			if (Object.keys(finishedData).length > 0)
				return (
					<div
						className={`card card__body answer finished ${
							// add 'correct' class if the answer is correct
							finishedData.data[
								questionNumber
							].correct_answers.includes(answer_.slug)
								? 'correct'
								: ''
						} ${
							// Add 'wrong' class if the selected answer is wrong
							finishedData.data[questionNumber].selected ===
								answer_.slug &&
							!finishedData.data[
								questionNumber
							].correct_answers.includes(answer_.slug)
								? 'wrong'
								: ''
						}`}
						key={index}
					>
						{answer_.answer}
					</div>
				)

			return (
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
						required
					/>

					{answer_.answer}
				</label>
			)
		})

		return answerList
	}
}

export default KnowledgeAnswers
