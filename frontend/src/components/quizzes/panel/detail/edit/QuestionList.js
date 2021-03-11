import React, { Component } from 'react'
import PropTypes from 'prop-types'

import objectsEquals from '../../../../../helpers/objectsEquals'
import Textarea from '../../../../Textarea'
import ImageUrlPreview from '../../../ImageUrlPreview'

import { RiImageEditFill, RiQuestionnaireFill } from 'react-icons/ri'
import KnowledgeAnswers from './answers/KnowledgeAnswers'
import PsychologyAnswers from './answers/PsychologyAnswers'
import PreferentialAnswers from './answers/PreferentialAnswers'
import UniversalAnswers from './answers/UniversalAnswers'
import { connect } from 'react-redux'

class QuestionList extends Component {
	static propTypes = {
		initialQuestions: PropTypes.array,
		questions: PropTypes.array,
		punctations: PropTypes.array,
		section_name: PropTypes.string.isRequired,
		removeQuestion: PropTypes.func.isRequired,
		hasChanged: PropTypes.func.isRequired,
		setQuestions: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => {
		const { setQuestions } = this.props
		let questions = this.props.questions

		questions = questions.map((question, index) => {
			if (index === parseInt(e.target.getAttribute('data-id'))) {
				return {
					...question,
					[e.target.name]: e.target.value,
				}
			}
			return question
		})

		setQuestions(questions)
	}

	componentDidUpdate(prevProps, _) {
		// Check if form has changed
		if (prevProps.questions !== this.props.questions) {
			const { hasChanged, initialQuestions, questions } = this.props

			if (
				this.props.initialQuestions.length !==
				this.props.questions.length
			) {
				hasChanged(true)
				return
			}

			if (
				hasChanged &&
				initialQuestions.length > 0 &&
				questions.length > 0
			) {
				// Check if questions has changed
				const questions1 = initialQuestions.map((question) => ({
					question: question.question,
					summery: question.summery,
					image_url: question.image_url,
				}))

				const questions2 = questions.map((question) => ({
					question: question.question,
					summery: question.summery,
					image_url: question.image_url,
				}))

				// array of booleans, true if object has change and false if not
				const hasChangedArray1 = questions.map(
					(_, index) =>
						!objectsEquals(questions1[index], questions2[index])
				)

				// Check if answers has changed
				const answers1 = initialQuestions.map((question) => ({
					...question.answers,
				}))

				const answers2 = questions.map((question) => ({
					...question.answers,
				}))

				// array of booleans, true if object has change and false if not
				const hasChangedArray2 = questions.map(
					(_, index) =>
						!objectsEquals(answers1[index], answers2[index])
				)

				// If true in array than the form has changed
				hasChanged(
					hasChangedArray1.some(
						(hasChanged) => hasChanged === true
					) ||
						hasChangedArray2.some(
							(hasChanged) => hasChanged === true
						)
				)
			}
		}
	}

	render() {
		const {
			questions,
			removeQuestion,
			hasChanged,
			setQuestions,
			section_name,
			punctations,
		} = this.props

		const questionList = questions.map((question, index) => {
			let answers

			if (section_name === 'knowledge_quiz')
				answers = (
					<KnowledgeAnswers
						answers={question.answers}
						questions={questions}
						questionIndex={index}
						hasChanged={hasChanged}
						setQuestions={setQuestions}
					/>
				)
			else if (section_name === 'universal_quiz')
				answers = (
					<UniversalAnswers
						answers={question.answers}
						questions={questions}
						questionIndex={index}
						hasChanged={hasChanged}
						setQuestions={setQuestions}
					/>
				)
			else if (section_name === 'preferential_quiz')
				answers = (
					<PreferentialAnswers
						answers={question.answers}
						questions={questions}
						questionIndex={index}
						hasChanged={hasChanged}
						setQuestions={setQuestions}
					/>
				)
			else if (section_name === 'psychology_quiz')
				answers = (
					<PsychologyAnswers
						answers={question.answers}
						punctationLength={punctations.length}
						section_name={section_name}
						questions={questions}
						questionIndex={index}
						hasChanged={hasChanged}
						setQuestions={setQuestions}
					/>
				)

			return (
				<div className="card" key={index}>
					<div className="card__body">
						<div className="row">
							<div className="col-md-7">
								<div className="form-control">
									<label className="form-control__label">
										Question:
									</label>
									<div className="icon-form">
										<span className="icon">
											<RiQuestionnaireFill />
										</span>

										<input
											type="text"
											data-id={index}
											onChange={this.onChange}
											name="question"
											value={
												this.props.questions[index]
													.question
											}
											className="form-control__input form-control__textarea"
											placeholder="Pass the question..."
											maxLength="100"
										/>
									</div>
								</div>

								{answers}

								<div className="form-control">
									<label className="form-control__label">
										Summery:
									</label>
									<Textarea
										data-id={index}
										onChange={this.onChange}
										name="summery"
										value={
											this.props.questions[index].summery
										}
										className="form-control__input form-control__textarea"
										placeholder="Pass the summery..."
										rows="3"
									/>
								</div>
							</div>
							<div className="col-md-5">
								<div className="form-control">
									<label className="form-control__label">
										Image Url:
									</label>
									<div className="icon-form">
										<span className="icon">
											<RiImageEditFill />
										</span>

										<input
											type="text"
											data-id={index}
											onChange={this.onChange}
											name="image_url"
											value={
												this.props.questions[index]
													.image_url
											}
											className="form-control__input form-control__textarea"
											placeholder="Pass the image url..."
											rows="3"
										/>
									</div>
								</div>
								<ImageUrlPreview
									image_url={
										this.props.questions[index].image_url
											.length > 0
											? this.props.questions[index]
													.image_url
											: 'https://static.thenounproject.com/png/2999524-200.png'
									}
									defaultImage="https://static.thenounproject.com/png/2999524-200.png"
								/>
							</div>
						</div>

						<button
							type="button"
							className="btn btn__danger"
							style={{ float: 'right', marginTop: '15px' }}
							onClick={() => removeQuestion(index)}
						>
							Delete
						</button>
					</div>
				</div>
			)
		})

		return questionList
	}
}

const mapStateToProps = (state) => ({
	punctations: state.quizzes.quizzes.item.punctations,
})

export default connect(mapStateToProps)(QuestionList)
