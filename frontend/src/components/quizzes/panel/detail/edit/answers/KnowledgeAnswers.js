import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MdQuestionAnswer } from 'react-icons/md'

import { clearErrors } from '../../../../../../redux/actions/errors'

class KnowledgeAnswers extends Component {
	static propTypes = {
		answers: PropTypes.array,
		questionId: PropTypes.number.isRequired,
		errors: PropTypes.object,
	}

	constructor(props) {
		super(props)

		const answers = props.answers.map((answer) => ({
			answer: answer.answer,
			image_url: answer.image_url,
		}))

		this.initialAnswers = answers

		this.state = {
			answers: this.initialAnswers,
			hasChanged: false,
		}

		this.addAnswer = this.addAnswer.bind(this)
		this.removeAnswer = this.removeAnswer.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	resetForm = () =>
		this.setState({
			answers: this.initialAnswers,
			hasChanged: false,
		})

	addAnswer = () =>
		this.setState({
			answers: [
				...this.state.answers,
				{
					answer: '',
					image_url: '',
				},
			],
		})

	removeAnswer = () => {}

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
						onChange={this.onChange}
						name="answer"
						value={this.state.answers[index].answer}
						className="form-control__input form-control__textarea"
						placeholder="Pass the question..."
						rows="3"
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
									className="btn"
									onClick={this.addAnswer}
								>
									Add Answer
								</button>
								<button
									type="button"
									className={`btn btn__danger ${
										answers.length <= 1
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
							<div className="inline-btns f-w">
								<button
									type="reset"
									onClick={this.resetForm}
									className={`btn ${
										!hasChanged ? 'btn__disabled' : ''
									}`}
								>
									Cancel
								</button>
								<button
									type="submit"
									className={`btn btn__contrast ${
										!hasChanged ? 'btn__disabled' : ''
									}`}
								>
									Save
								</button>
							</div>
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
