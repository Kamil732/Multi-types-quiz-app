import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Title from '../../../common/Title'

import axios from 'axios'

import CircleLoader from '../../../components/loaders/CircleLoader'
import OnePageQuiz from './OnePageQuiz'
import MultiPageQuiz from './MultiPageQuiz'
import FeedbackForm from '../../../components/quizzes/panel/detail/FeedbackForm'

class Start extends Component {
	static propTypes = {
		author_slug: PropTypes.string.isRequired,
		isOwner: PropTypes.bool,
		data: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			questions: [],
			timer: 0,
			finished_data: {},
		}

		this.getQuestions = this.getQuestions.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	getQuestions = () => {
		this.setState({ loading: true })
		const { data } = this.props

		axios
			.get(data.questions)
			.then((res) => {
				this.setState({
					loading: false,
					questions: res.data,
				})
			})
			.catch((err) =>
				this.setState({
					loading: false,
					questions: [],
				})
			)
	}

	componentDidMount = () => {
		this.getQuestions()

		this.timer = setInterval(
			() =>
				this.setState((prevState) => ({ timer: prevState.timer + 1 })),
			1000
		)
	}

	componentDidUpdate(prevProps, _) {
		if (prevProps.data !== this.props.data) this.getQuestions()
	}

	onSubmit = (e) => {
		e.preventDefault()
		const { data } = this.props
		const { questions } = this.state

		let answeredQuestions = {
			section: data.section.name,
			data: [],
		}

		for (const question of questions)
			try {
				const answer = document.querySelector(
					`input[name="answer-${question.id}"]:checked`
				).value

				answeredQuestions.data.push({
					questionId: question.id,
					answer: answer,
				})
			} catch (err) {
				answeredQuestions.data.push({
					questionId: question.id,
					answer: null,
				})
			}

		const config = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Accept-Language': 'en',
			},
		}

		const body = JSON.stringify(answeredQuestions)

		axios
			.post(
				`${process.env.REACT_APP_API_URL}/quizzes/${data.author_slug}/${data.slug}/finish/`,
				body,
				config
			)
			.then((res) => {
				this.setState({ finished_data: res.data })
				clearInterval(this.timer)

				window.scrollTo({ top: 0, behavior: `smooth` })
			})
	}

	render() {
		const { data } = this.props
		const { loading, questions, timer, finished_data } = this.state

		if (loading === true) return <CircleLoader />

		let result
		if (finished_data.section === 'knowledge_quiz')
			result = (
				<>
					On {questions.length} questions you have answered{' '}
					{finished_data.correctAnswers} corrctly
				</>
			)

		return (
			<>
				<Title title={`Start Quiz - ${data.title}`} />

				{Object.keys(finished_data).length > 0 ? (
					<div className="card">
						<div className="card__body">
							<h6>You have finished quiz in {timer} seconds</h6>
							<h3>{result}</h3>
							{data.is_published === false ? (
								<div className="card__body">
									<FeedbackForm
										ask_name={data.ask_name}
										ask_email={data.ask_email}
										ask_gender={data.ask_gender}
										ask_opinion={data.ask_opinion}
										author_slug={data.author_slug}
										quiz_slug={data.slug}
									/>
								</div>
							) : null}
						</div>
						<hr />
						<div className="card__body">
							<OnePageQuiz
								questions={questions}
								section={data.section.name}
								finishedData={finished_data}
							/>
						</div>
					</div>
				) : (
					<form onSubmit={this.onSubmit}>
						{data.one_page_questions === true ? (
							<OnePageQuiz
								questions={questions}
								section={data.section.name}
								finishedData={finished_data}
							/>
						) : (
							<MultiPageQuiz
								questions={questions}
								section={data.section.name}
								finishedData={finished_data}
							/>
						)}

						<div>
							<div className="card__footer">
								<button className="btn btn__submit">
									Finish
								</button>
							</div>
						</div>
					</form>
				)}
			</>
		)
	}
}

export default Start
