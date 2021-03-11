import { Component } from 'react'
import PropTypes from 'prop-types'

import uuid from 'uuid/dist/v4'

import objectsEquals from '../../../../../../helpers/objectsEquals'

class Answer extends Component {
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
		this.onChangeTextField = this.onChangeTextField.bind(this)
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
									id: uuid(),
									answer: '',
									image_url: '',
									points: 0,
									results: [],
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

	onChange = (id, name, value) => {
		let answers = this.props.answers

		// Change answers
		answers = answers.map((answer, index) => {
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
}

export default Answer
