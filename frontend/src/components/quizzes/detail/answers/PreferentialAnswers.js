import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PreferentialAnswers extends Component {
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
				((answer_.answered_times + (isSelected ? 1 : 0)) * 100) /
					(answered_times + 1)
			)

			const voted = answer_.answered_times + (isSelected ? 1 : 0)

			if (Object.keys(finishedData).length > 0)
				return (
					<div
						className={`card card__body answer finished ${
							finishedData.data[questionNumber].selected ===
							answer_.slug
								? 'selected'
								: ''
						}`}
						key={index}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<h4>{percentage}%</h4>
							<h4>voted: {voted}</h4>
						</div>
						<div className="progress-bar">
							<div style={{ width: percentage + '%' }}></div>
						</div>

						<h4>{answer_.answer}</h4>
					</div>
				)
			else if (answer)
				return (
					<label
						className={`card card__body answer finished ${
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
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<h4>{percentage}%</h4>
							<h4>voted: {voted}</h4>
						</div>
						<div className="progress-bar">
							<div style={{ width: percentage + '%' }}></div>
						</div>

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

export default PreferentialAnswers
