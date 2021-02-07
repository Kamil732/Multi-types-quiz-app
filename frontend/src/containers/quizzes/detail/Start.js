import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Title from '../../../common/Title'
import axios from 'axios'

import CircleLoader from '../../../components/loaders/CircleLoader'
import OnePageQuiz from './OnePageQuiz'
import MultiPageQuiz from './MultiPageQuiz'

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
			.then((res) =>
				this.setState({
					loading: false,
					questions: res.data,
				})
			)
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
				window.scrollTo(0, 0)
			})
	}

	render() {
		const { data } = this.props
		const { loading, questions, finished_data } = this.state

		if (loading === true) return <CircleLoader />

		return (
			<>
				<Title title={`Start Quiz - ${data.title}`} />

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

					<button className="btn btn__submit btn__contrast">
						Finish
					</button>
				</form>
			</>
		)
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Start)
