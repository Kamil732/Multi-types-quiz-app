import { Component } from 'react'
import PropTypes from 'prop-types'

import uuid from 'uuid/dist/v4'

class Answer extends Component {
	static propTypes = {
		initialAnswers: PropTypes.array,
		answers: PropTypes.array,
		questions: PropTypes.array,
		questionIndex: PropTypes.number,
		punctations: PropTypes.array,
		section_name: PropTypes.string,
		errors: PropTypes.object,
		setQuestions: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			hasChanged: false,
		}

		this.addAnswer = this.addAnswer.bind(this)
		this.removeAnswer = this.removeAnswer.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.onChangeTextField = this.onChangeTextField.bind(this)
	}

	resetForm = () => {
		// Reset answers
		this.props.setQuestions(
			this.props.questions.map((question, index) => {
				if (index === this.props.questionIndex)
					return {
						...question,
						answers: this.props.initialAnswers,
					}

				return question
			})
		)

		this.setState({
			hasChanged: false,
		})
	}

	addAnswer = () => {
		let shouldAdd = false

		if (
			this.props.answers.length < 8 &&
			this.props.section_name !== 'psychology_quiz'
		)
			shouldAdd = true
		else if (
			this.props.answers.length < this.props.punctations.length &&
			this.props.section_name === 'psychology_quiz'
		)
			shouldAdd = true

		if (shouldAdd) {
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
									id: uuid(),
									answer: '',
									image_url: '',
									points: '0',
									results:
										this.props.section_name ===
											'psychology_quiz' &&
										question.answers.length === 0
											? this.props.punctations
											: [],
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
					if (index === this.props.questionIndex) {
						let answers = this.props.answers.slice(0, -1)

						if (this.props.section_name === 'psychology_quiz') {
							const removed_results = this.props.answers.slice(
								-1
							)[0].results

							answers = answers.map((answer, index) => {
								if (index === answers.length - 1)
									return {
										...answer,
										results: [
											...answer.results,
											...removed_results,
										],
									}

								return answer
							})
						}

						// then return question with changed answers
						return {
							...question,
							answers,
						}
					}

					return question
				})
			)

			this.setState({
				hasChanged: true,
			})
		}
	}

	onChange = (id, name, value) => {
		// Change answers
		const answers = this.props.answers.map((answer, index) => {
			if (index === parseInt(id))
				return {
					...answer,
					[name]: value,
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

	onChangeTextField = (e) =>
		this.onChange(
			e.target.getAttribute('data-id'),
			e.target.name,
			e.target.value
		)

	componentDidUpdate(prevProps, _) {
		// Update answers when questions changes
		if (
			JSON.stringify(prevProps.initialAnswers) !==
			JSON.stringify(this.props.initialAnswers)
		)
			this.setState({ hasChanged: false })

		if (
			JSON.stringify(prevProps.answers) !==
			JSON.stringify(this.props.answers)
		) {
			// Check if form has changed
			if (
				this.props.initialAnswers.length === this.props.answers.length
			) {
				const initialAnswers = this.props.initialAnswers.map(
					(answer) => ({
						answer: answer.answer,
						points: parseInt(answer.points),
						image_url: answer.image_url,
						results: answer.results,
					})
				)

				const answers = this.props.answers.map((answer) => ({
					answer: answer.answer,
					points: parseInt(answer.points),
					image_url: answer.image_url,
					results: answer.results,
				}))

				this.setState({
					hasChanged:
						JSON.stringify(initialAnswers) !==
						JSON.stringify(answers),
				})
			}
			// If lengths of two arrays are diffrent then of course form has changed
			else this.setState({ hasChanged: true })
		}
	}
}

export default Answer
