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
		questionId: PropTypes.number.isRequired,
		errors: PropTypes.object,
		hasChanged: PropTypes.func.isRequired,
		setQuestions: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.initialAnswers = props.answers.map((answer) => ({
			answer: answer.answer,
			image_url: answer.image_url,
		}))

		this.state = {
			hasChanged: false,
		}

		this.addAnswer = this.addAnswer.bind(this)
		this.removeAnswer = this.removeAnswer.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	resetForm = () => {
		// Reset answers
		this.props.setQuestions(
			this.props.questions.map((question) => {
				if (question.id === this.props.questionId)
					return {
						...question,
						answers: this.initialAnswers,
					}

				return question
			})
		)

		this.props.hasChanged(true)
		this.setState({
			hasChanged: false,
		})
	}

	addAnswer = () => {
		if (this.props.answers.length < 8) {
			this.props.setQuestions(
				this.props.questions.map((question) => {
					// if this is the question where our answers are
					if (question.id === this.props.questionId)
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

			this.props.hasChanged(true)
			this.setState({
				hasChanged: true,
			})
		}
	}

	removeAnswer = () => {
		if (this.props.answers.length > 2) {
			this.props.setQuestions(
				this.props.questions.map((question) => {
					// if this is the question where our answers are
					if (question.id === this.props.questionId)
						// then return question with changed answers
						return {
							...question,
							answers: this.props.answers.slice(0, -1),
						}

					return question
				})
			)
			this.props.hasChanged(true)
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
			this.props.questions.map((question) => {
				// if this is the question where our answers are
				if (question.id === this.props.questionId)
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
		if (prevProps.questionId !== this.props.questionId) {
			this.initialAnswers = this.props.answers.map((answer) => ({
				answer: answer.answer,
				image_url: answer.image_url,
			}))
			this.setState({ hasChanged: false })
		}

		if (prevProps.answers !== this.props.answers) {
			// Set hasChanged to false when forms are reseted
			this.props.hasChanged(false)
			this.setState({ hasChanged: false })

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
				this.props.hasChanged(
					hasChangedArray.some((hasChanged) => hasChanged === true)
				)
				this.setState({
					hasChanged: hasChangedArray.some(
						(hasChanged) => hasChanged === true
					),
				})
			}
		}
	}

	onSubmit = (e) => {
		e.preventDefault()
		console.log('submitted')
	}

	render() {
		const { questionId, errors } = this.props
		const { hasChanged } = this.state

		const answers = this.props.answers.map((answer, index) => (
			<div className="form-control" key={index}>
				<label className="form-control__label">
					Answer {index + 1}:
				</label>
				<div className="icon-form">
					<span className="icon">
						<MdQuestionAnswer />
					</span>

					<input
						type="text"
						id={`answer-${index}-${questionId}`}
						data-id={index}
						onChange={this.onChange}
						name="answer"
						value={this.props.answers[index].answer}
						className="form-control__input form-control__textarea"
						placeholder={`Pass the ${index + 1} answer...`}
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
