import React, { Component } from 'react'
import PropTypes from 'prop-types'

import objectsEquals from '../../../../../helpers/objectsEquals'
import Textarea from '../../../../Textarea'
import ImageUrlPreview from '../../../ImageUrlPreview'

import { RiImageEditFill, RiQuestionnaireFill } from 'react-icons/ri'

class QuestionList extends Component {
	static propTypes = {
		initialQuestions: PropTypes.array,
		questions: PropTypes.array,
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
				hasChanged &&
				initialQuestions.length > 0 &&
				questions.length > 0
			) {
				// array of booleans, true if object has change and false if not
				const hasChangedArray = questions.map(
					(_, index) =>
						!objectsEquals(
							initialQuestions[index],
							questions[index]
						)
				)

				// If true in array than the form has changed
				hasChanged(
					hasChangedArray.some((hasChanged) => hasChanged === true)
				)
			}
		}
	}

	render() {
		const { questions, removeQuestion } = this.props

		const questionList = questions.map((question, index) => (
			<div className="card" key={index}>
				<div className="card__body">
					<div className="row">
						<div className="col-sm-7">
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
										id={`question-${index}`}
										data-id={index}
										onChange={this.onChange}
										name="question"
										value={
											this.props.questions[index].question
										}
										className="form-control__input form-control__textarea"
										placeholder="Pass the question..."
										rows="3"
									/>
								</div>
							</div>
							<div className="form-control">
								<label className="form-control__label">
									Summery:
								</label>
								<Textarea
									id={`summery-${index}`}
									data-id={index}
									onChange={this.onChange}
									name="summery"
									value={this.props.questions[index].summery}
									className="form-control__input form-control__textarea"
									placeholder="Pass the summery..."
									rows="3"
								/>
							</div>
						</div>
						<div className="col-sm-5">
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
										id={`image-url-${index}`}
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
										? this.props.questions[index].image_url
										: 'https://static.thenounproject.com/png/2999524-200.png'
								}
								defaultImage="https://static.thenounproject.com/png/2999524-200.png"
							/>
						</div>
					</div>

					<button
						className="btn btn__danger"
						style={{ float: 'right', marginTop: '15px' }}
						onClick={() => removeQuestion(index)}
					>
						Delete
					</button>
				</div>
			</div>
		))

		return questionList
	}
}

export default QuestionList
