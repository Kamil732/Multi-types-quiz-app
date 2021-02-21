import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PreferentailAnswers extends Component {
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
		const { answers, questionId, finishedData, questionNumber } = this.props
		const { answer } = this.state

		const answerList = answers.map((answer_, index) => {
			const isSelected =
				answer === answer_.slug ||
				(Object.keys(finishedData).length > 0 &&
					finishedData.data[questionNumber].selected === answer_.slug)

			let answered_times = answers
				.map((answer) => answer.answered_times)
				.reduce((a, b) => a + b, 0)

			const percentage = Math.round(
				answered_times !== 0
					? ((answer_.answered_times + (isSelected ? 1 : 0)) * 100) /
							(answered_times + 1)
					: 0
			)

			const voted = answer_.answered_times + (isSelected ? 1 : 0)

			if (Object.keys(finishedData).length > 0)
				return (
					<div
						className={`card card__body answer finished preferential ${
							finishedData.data[questionNumber].selected ===
							answer_.slug
								? 'selected'
								: ''
						}`}
						key={index}
					>
						<h4 className="preferential-answer__percents">
							{percentage}%
						</h4>
						<h4 className="progress-bar">voted: {voted}</h4>
						<h4>{answer_.answer}</h4>
					</div>
				)
			else if (answer)
				return (
					<label
						className={`card card__body answer finished preferential-answer ${
							answer === answer_.slug ? 'selected' : ''
						}`}
						key={index}
					>
						<input
							type="radio"
							name={`answer-${questionId}`}
							value={answer_.slug}
							onChange={this.onChange}
							checked={answer === answer_.slug}
							readOnly
							disabled
						/>
						<h4 className="preferential-answer__percents">
							{percentage}%
						</h4>
						<h4 className="progress-bar">voted: {voted}</h4>
						<h4>{answer_.answer}</h4>
					</label>
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

export default PreferentailAnswers
