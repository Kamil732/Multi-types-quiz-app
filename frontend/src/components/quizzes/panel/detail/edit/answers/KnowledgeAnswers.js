import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MdQuestionAnswer } from 'react-icons/md'

import { clearErrors } from '../../../../../../redux/actions/errors'
import objectsEquals from '../../../../../../helpers/objectsEquals'

class KnowledgeAnswers extends Component {
	static propTypes = {
		answers: PropTypes.array,
		questionId: PropTypes.number.isRequired,
		errors: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.initialAnswers = props.answers.map((answer) => ({
			answer: answer.answer,
			image_url: answer.image_url,
		}))

		this.state = {
			answers: this.initialAnswers,
			hasChanged: false,
		}

		this.addAnswer = this.addAnswer.bind(this)
		this.removeAnswer = this.removeAnswer.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	resetForm = () =>
		this.setState({
			answers: this.initialAnswers,
			hasChanged: false,
		})

	addAnswer = () => {
		if (this.state.answers.length < 8) {
			this.setState({
				hasChanged: true,
				answers: [
					...this.state.answers,
					{
						answer: '',
						image_url: '',
					},
				],
			})
		}
	}

	removeAnswer = () => {
		if (this.state.answers.length > 2)
			this.setState({
				hasChanged: true,
				answers: this.state.answers.slice(0, -1),
			})
	}

	onChange = (e) => {
		let answers = this.state.answers

		answers = answers.map((answer, index) => {
			if (index === parseInt(e.target.getAttribute('data-id'))) {
				return {
					...answer,
					[e.target.name]: e.target.value,
				}
			}

			return answer
		})

		this.setState({ answers })
	}

	componentDidUpdate(prevProps, prevState) {
		// Update answers when questions changes
		if (prevProps.answers !== this.props.answers) {
			this.initialAnswers = this.props.answers.map((answer) => ({
				answer: answer.answer,
				image_url: answer.image_url,
			}))

			this.setState({
				answers: this.initialAnswers,
				hasChanged: false,
			})
		}
		// Check if form has changed
		if (
			prevState.answers !== this.state.answers &&
			this.initialAnswers.length === this.state.answers.length
		) {
			// array of booleans, true if object has change and false if not
			const hasChangedArray = this.state.answers.map(
				(_, index) =>
					!objectsEquals(
						this.initialAnswers[index],
						this.state.answers[index]
					)
			)

			// If true in array than the form has changed
			this.setState({
				hasChanged: hasChangedArray.some(
					(hasChanged) => hasChanged === true
				),
			})
		}
	}

	onSubmit = (e) => {
		e.preventDefault()
		console.log('submitted')
	}

	render() {
		const { questionId, errors } = this.props
		const { hasChanged } = this.state

		const answers = this.state.answers.map((answer, index) => (
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
						value={this.state.answers[index].answer}
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
					<form onSubmit={this.onSubmit}>
						{answers}

						<hr />
						<div className="card__body">
							<div className="inline-btns">
								<button
									type="button"
									className={`btn ${
										answers.length >= 8
											? 'btn__disabled'
											: ''
									}`}
									onClick={this.addAnswer}
								>
									Add Answer
								</button>
								<button
									type="button"
									className={`btn btn__danger ${
										answers.length <= 2
											? 'btn__disabled'
											: ''
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
					</form>
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
