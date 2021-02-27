import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import objectsEquals from '../../../../../helpers/objectsEquals'
import Textarea from '../../../../Textarea'
import ImageUrlPreview from '../../../ImageUrlPreview'

import { RiImageEditFill, RiQuestionnaireFill } from 'react-icons/ri'

export class QuestionList extends Component {
	static propTypes = {
		questions: PropTypes.array,
		section_name: PropTypes.string.isRequired,
		removeQuestion: PropTypes.func.isRequired,
		hasChanged: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.data = Object.values(this.props.questions)
		this.dataRefs = []

		this.hasChanged = this.hasChanged.bind(this)
	}

	hasChanged = () => {
		const { hasChanged, questions } = this.props

		// Update data
		for (let i = 0; i < this.dataRefs.length; i++) {
			this.data[i] = {
				question: this.dataRefs[i].question.value,
				image_url: this.dataRefs[i].image_url.value,
				summery: this.dataRefs[i].summery.value(), // .value() is function because summery is component
			}
		}

		// array of booleans, true if object has change otherwise false
		const hasChangedArray = this.data.map(
			(_, index) => !objectsEquals(questions[index], this.data[index])
		)

		// If true in array than the form has changed
		hasChanged(hasChangedArray.some((hasChanged) => hasChanged === true))
	}

	componentDidUpdate(prevProps, _) {
		if (prevProps.questions.length > this.props.questions.length) {
			// Delete unnecessary data
			for (
				let i = 0;
				i < prevProps.questions.length - this.props.questions.length;
				i++
			) {
				this.dataRefs.pop()
				this.data.pop()
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
										onChange={this.hasChanged}
										name="question"
										defaultValue={question.question}
										className="form-control__input form-control__textarea"
										placeholder="Pass the question..."
										rows="3"
										ref={(ref) =>
											(this.dataRefs[index] = {
												...this.dataRefs[index],
												question: ref,
											})
										}
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
									onChange={this.hasChanged}
									name="summery"
									defaultValue={question.summery}
									className="form-control__input form-control__textarea"
									placeholder="Pass the summery..."
									rows="3"
									ref={(ref) =>
										(this.dataRefs[index] = {
											...this.dataRefs[index],
											summery: ref,
										})
									}
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
										onChange={this.hasChanged}
										name="image_url"
										defaultValue={question.image_url}
										className="form-control__input form-control__textarea"
										placeholder="Pass the image url..."
										rows="3"
										ref={(ref) =>
											(this.dataRefs[index] = {
												...this.dataRefs[index],
												image_url: ref,
											})
										}
									/>
								</div>
							</div>
							<ImageUrlPreview
								image_url={
									!this.dataRefs[index] ||
									this.dataRefs[index].image_url.value
										.length === 0
										? 'https://static.thenounproject.com/png/2999524-200.png'
										: this.dataRefs[index].image_url.value
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

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList)
