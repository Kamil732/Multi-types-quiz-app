import React, { Component } from 'react'
import PropTypes from 'prop-types'
import KnowledgeAnswers from './answers/KnowledgeAnswers'
import PsychologyAnswers from './answers/PsychologyAnswers'
import PreferentailAnswers from './answers/PreferentailAnswers'
import UniversalAnswers from './answers/UniversalAnswers'

class OnePageQuiz extends Component {
	static propTypes = {
		questions: PropTypes.array,
		section: PropTypes.string.isRequired,
		finishedData: PropTypes.object,
	}

	render() {
		const { questions, section, finishedData } = this.props

		const questionList = questions.map((question, index) => {
			let answers

			if (section === 'knowledge_quiz')
				answers = (
					<KnowledgeAnswers
						questionNumber={index}
						answers={question.answers}
						questionId={question.id}
						finishedData={finishedData}
					/>
				)
			else if (section === 'universal_quiz')
				answers = (
					<UniversalAnswers
						questionNumber={index}
						answers={question.answers}
						questionId={question.id}
						finishedData={finishedData}
					/>
				)
			else if (section === 'psychology_quiz')
				answers = (
					<PsychologyAnswers
						answers={question.answers}
						questionId={question.id}
					/>
				)
			else if (section === 'preferential_quiz')
				answers = (
					<PreferentailAnswers
						answers={question.answers}
						questionId={question.id}
					/>
				)

			return (
				<div className="card" key={index}>
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
			)
		})

		return questionList
	}
}

export default OnePageQuiz
