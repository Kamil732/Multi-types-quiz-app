import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PreferentailAnswers from '../../../components/quizzes/detail/answers/PreferentailAnswers'
import PsychologyAndUniversalAnswers from '../../../components/quizzes/detail/answers/PsychologyAndUniversalAnswers'
import KnowledgeAnswers from '../../../components/quizzes/detail/answers/KnowledgeAnswers'

class MultiPageQuiz extends Component {
	static propTypes = {
		questions: PropTypes.array,
		section: PropTypes.string.isRequired,
		finishedData: PropTypes.object,
	}

	constructor(props) {
		super(props)
		const { questions, section, finishedData } = this.props

		this.state = {
			questionNumber: 0,
			answersRef: null,
			answeredQuestions: [],
		}

		this.questionList = questions.map((question, index) => {
			let answers

			if (section === 'knowledge_quiz')
				answers = (
					<KnowledgeAnswers
						questionNumber={index}
						answers={question.answers}
						questionId={question.id}
						finishedData={finishedData}
						ref={(ref) => this.setState({ answersRef: ref })}
					/>
				)
			else if (
				section === 'universal_quiz' ||
				section === 'psychology_quiz'
			)
				answers = (
					<PsychologyAndUniversalAnswers
						questionNumber={index}
						answers={question.answers}
						questionId={question.id}
						finishedData={finishedData}
						ref={(ref) => this.setState({ answersRef: ref })}
					/>
				)
			else if (section === 'preferential_quiz')
				answers = (
					<PreferentailAnswers
						questionNumber={index}
						answers={question.answers}
						questionId={question.id}
						finishedData={finishedData}
						ref={(ref) => this.setState({ answersRef: ref })}
					/>
				)

			return (
				<React.Fragment key={index}>
					<div className="card">
						<div className="card__header">Question {index + 1}</div>
						<div className="card__body">
							<div className="card card__body">
								<div
									className="quiz-detail"
									style={{ backgroundColor: 'inherit' }}
								>
									{question.image_url.length > 0 ? (
										<img
											src={question.image_url}
											className="quiz-detail__img"
											alt=""
										/>
									) : null}
									<p
										style={{
											fontWeight: '600',
											fontSize: '1.1rem',
										}}
									>
										{question.question}
									</p>
								</div>
							</div>
							<div className="answer-container">{answers}</div>
						</div>
					</div>
				</React.Fragment>
			)
		})

		this.nextQuestion = this.nextQuestion.bind(this)
	}

	nextQuestion = (e) => {
		this.setState({
			questionNumber: this.state.questionNumber + 1,
			answeredQuestions: [
				...this.state.answeredQuestions,
				<input
					key={this.state.questionNumber}
					type="radio"
					name={`answer-${e.target.getAttribute('data-id')}`}
					value={this.state.answersRef.state.answer}
					checked
					readOnly
				/>,
			],
		})
	}

	render() {
		const { questionNumber, answeredQuestions, answersRef } = this.state

		return (
			<>
				<div style={{ display: 'none' }}>{answeredQuestions}</div>

				{this.questionList[questionNumber]}
				{questionNumber === this.questionList.length - 1 ? (
					<div>
						<div className="card__footer">
							<button
								type="submit"
								className={`btn btn__submit ${
									answersRef?.state.answer.length > 0
										? ''
										: 'btn__disabled'
								}`}
							>
								Finish
							</button>
						</div>
					</div>
				) : (
					<div>
						<div className="card__footer">
							<button
								type="button"
								className={`btn btn__contrast btn__submit ${
									answersRef?.state.answer.length > 0
										? ''
										: 'btn__disabled'
								}`}
								data-id={answersRef?.props.questionId}
								onClick={this.nextQuestion}
							>
								Next Question
							</button>
						</div>
					</div>
				)}
			</>
		)
	}
}

export default MultiPageQuiz
