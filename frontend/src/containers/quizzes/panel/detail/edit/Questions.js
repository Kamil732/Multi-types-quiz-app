import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Title from '../../../../../common/Title'

import { clearErrors } from '../../../../../redux/actions/errors'
import {
	updateQuizQuestions,
	updateQuizData,
} from '../../../../../redux/actions/quizzes'
import axios from 'axios'

import CircleLoader from '../../../../../components/loaders/CircleLoader'
import QuestionList from '../../../../../components/quizzes/panel/detail/edit/QuestionList'
class Questions extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		errors: PropTypes.object,
		clearErrors: PropTypes.func.isRequired,
		updateQuizQuestions: PropTypes.func.isRequired,
		updateQuizData: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.initialQuestions = []

		this.state = {
			loading: true,
			questions: [],
			hasChanged: false,
		}

		this.getQuestions = this.getQuestions.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.addQuestion = this.addQuestion.bind(this)
		this.removeQuestion = this.removeQuestion.bind(this)
	}

	resetForm = () => {
		this.props.clearErrors()

		this.setState({
			questions: this.initialQuestions,
			hasChanged: false,
		})
	}

	addQuestion = () => {
		const { questions } = this.state

		this.setState({
			hasChanged: true,
			questions: [
				...questions,
				{
					answers: [
						{
							answer: '',
							image_url: '',
						},
						{
							answer: '',
							image_url: '',
						},
					],
					question: '',
					image_url: '',
					summery: '',
				},
			],
		})
	}

	removeQuestion = (index) => {
		if (index >= 0 && this.state.questions.length > 1) {
			const questions = Array.from(this.state.questions)
			questions.splice(index, 1)

			this.setState({
				hasChanged: true,
				questions,
			})
		}
	}

	getQuestions = () => {
		this.setState({ loading: true })
		const { data } = this.props

		axios
			.get(
				`${process.env.REACT_APP_API_URL}/quizzes/${data.author_slug}/${data.slug}/questions/update-list/`
			)
			.then((res) => {
				this.setState({
					loading: false,
					questions: res.data,
				})

				this.initialQuestions = res.data
			})
			.catch((err) =>
				this.setState({
					loading: false,
					questions: [],
				})
			)
	}

	componentDidMount = () => this.getQuestions()

	componentDidUpdate(prevProps, _) {
		if (prevProps.data !== this.props.data) this.getQuestions()
	}

	onSubmit = async (e) => {
		e.preventDefault()

		await this.props.clearErrors()
		await this.props.updateQuizQuestions(
			this.props.data.author_slug,
			this.props.data.slug,
			this.state.questions
		)
		// Refresh quiz data
		let max_score
		if (this.props.data.section.name === 'knowledge_quiz')
			max_score = this.state.questions.length

		await this.props.updateQuizData(
			this.props.data.author_slug,
			this.props.data.slug,
			{
				max_score,
				question_amount: this.state.questions.length,
			}
		)

		if (Object.keys(this.props.errors).length === 0) {
			this.setState({ hasChanged: false })
			this.initialQuestions = this.state.questions
		}
	}

	render() {
		const { data, errors } = this.props
		const { loading, questions, hasChanged } = this.state

		return (
			<>
				<Title title={`${this.props.data.title} - Questions`} />

				<div className="card">
					{loading ? (
						<div className="card__body">
							<CircleLoader />
						</div>
					) : (
						<>
							<form onSubmit={this.onSubmit}>
								<div className="card__body">
									<QuestionList
										initialQuestions={this.initialQuestions}
										questions={questions}
										section_name={data.section.name}
										removeQuestion={(index) =>
											this.removeQuestion(index)
										}
										hasChanged={(state) =>
											this.setState({ hasChanged: state })
										}
										setQuestions={(state) =>
											this.setState({ questions: state })
										}
									/>
								</div>

								<hr />
								<div className="card__body">
									<button
										type="button"
										className="btn"
										onClick={this.addQuestion}
									>
										Add Question
									</button>
									<br />

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
												!hasChanged
													? 'btn__disabled'
													: ''
											}`}
										>
											Cancel
										</button>
										<button
											type="submit"
											className={`btn btn__contrast ${
												!hasChanged
													? 'btn__disabled'
													: ''
											}`}
										>
											Save
										</button>
									</div>
								</div>
							</form>
						</>
					)}
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	clearErrors,
	updateQuizQuestions,
	updateQuizData,
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
