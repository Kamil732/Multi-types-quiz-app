import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MdQuestionAnswer } from 'react-icons/md'

import { clearErrors } from '../../../../../../redux/actions/errors'
import objectsEquals from '../../../../../../helpers/objectsEquals'

class KnowledgeAnswers extends Component {
	static propTypes = {
		answers: PropTypes.array,
		questions: PropTypes.array,
		questionIndex: PropTypes.number,
		errors: PropTypes.object,
		setQuestions: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.initialAnswers = props.answers

		this.state = {
			hasChanged: false,
		}

		this.addAnswer = this.addAnswer.bind(this)
		this.removeAnswer = this.removeAnswer.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	resetForm = () => {
		// Reset answers
		this.props.setQuestions(
			this.props.questions.map((question, index) => {
				if (index === this.props.questionIndex)
					return {
						...question,
						answers: this.initialAnswers,
					}

				return question
			})
		)

		this.setState({
			hasChanged: false,
		})
	}

	addAnswer = () => {
		if (this.props.answers.length < 8) {
			this.props.setQuestions(
				this.props.questions.map((question, index) => {
					// if this is the question where our answers are
					if (index === this.props.questionIndex)
						// then return question with changed answers
						return {
							...question,
							answers: [
								...question.answers,
								// Add answer
								{
									answer: '',
									image_url: '',
								},
							],
						}

					return question
				})
			)

			this.setState({
				hasChanged: true,
			})
		}
	}

	removeAnswer = () => {
		if (this.props.answers.length > 2) {
			this.props.setQuestions(
				this.props.questions.map((question, index) => {
					// if this is the question where our answers are
					if (index === this.props.questionIndex)
						// then return question with changed answers
						return {
							...question,
							answers: this.props.answers.slice(0, -1),
						}

					return question
				})
			)

			this.setState({
				hasChanged: true,
			})
		}
	}

	onChange = (e) => {
		let answers = this.props.answers

		// Change answers
		answers = answers.map((answer, index) => {
			if (index === parseInt(e.target.getAttribute('data-id')))
				return {
					...answer,
					[e.target.name]: e.target.value,
				}

			return answer
		})

		// Change questions with answers
		this.props.setQuestions(
			this.props.questions.map((question, index) => {
				// if this is the question where our answers are
				if (index === this.props.questionIndex)
					// then return question with changed answers
					return {
						...question,
						answers,
					}

				return question
			})
		)
	}

	componentDidUpdate(prevProps, prevState) {
		// Update answers when questions changes
		if (prevProps.questionIndex !== this.props.questionIndex) {
			this.initialAnswers = this.props.answers
			this.setState({ hasChanged: false })
		}

		if (
			JSON.stringify(prevProps.answers) !==
			JSON.stringify(this.props.answers)
		) {
			// Check if form has changed
			if (this.initialAnswers.length === this.props.answers.length) {
				// array of booleans, true if object has change and false if not
				const hasChangedArray = this.props.answers.map(
					(_, index) =>
						!objectsEquals(
							this.initialAnswers[index],
							this.props.answers[index]
						)
				)

				// If true in array than the form has changed
				this.setState({
					hasChanged: hasChangedArray.some(
						(hasChanged) => hasChanged === true
					),
				})
			}
			// If lengths of two arrays are diffrent then of course form has changed
			else this.setState({ hasChanged: true })
		}
	}

	render() {
		const { errors } = this.props
		const { hasChanged } = this.state

		const answers = this.props.answers.map((answer, index) => (
			<div
				className={`form-control ${
					index === 0 ? 'correct-answer' : ''
				}`}
				key={index}
			>
				<label className="form-control__label">
					{index === 0 ? 'Correct Answer' : `Answer ${index + 1}`}:
				</label>
				<div className="icon-form">
					<span className="icon">
						<MdQuestionAnswer />
					</span>

					<input
						type="text"
						data-id={index}
						onChange={this.onChange}
						name="answer"
						value={this.props.answers[index].answer}
						className="form-control__input"
						placeholder={`Pass the ${
							index === 0 ? 'correct' : index + 1
						} answer...`}
						maxLength="100"
						required
					/>
				</div>
			</div>
		))

		return (
			<div className="card">
				<div className="card__body">
					{answers}

					<hr />
					<div className="card__body">
						<div className="inline-btns">
							<button
								type="button"
								className={`btn ${
									answers.length >= 8 ? 'btn__disabled' : ''
								}`}
								onClick={this.addAnswer}
							>
								Add Answer
							</button>
							<button
								type="button"
								className={`btn btn__danger ${
									answers.length <= 2 ? 'btn__disabled' : ''
								}`}
								onClick={this.removeAnswer}
							>
								Remove Answer
							</button>
						</div>
						<br /> <br />
						{errors.detail ? (
							<div className="message-box error">
								<p className="message-box__text">
									{errors.detail}
								</p>
							</div>
						) : null}
						<button
							type="reset"
							onClick={this.resetForm}
							className={`btn ${
								!hasChanged ? 'btn__disabled' : ''
							}`}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(KnowledgeAnswers)
