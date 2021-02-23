import React, { Component } from 'react'
import PropTypes from 'prop-types'

import KnowledgeAnswers from '../../../components/quizzes/detail/answers/KnowledgeAnswers'
import PreferentailAnswers from '../../../components/quizzes/detail/answers/PreferentailAnswers'
import PsychologyAndUniversalAnswers from '../../../components/quizzes/detail/answers/PsychologyAndUniversalAnswers'

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
					/>
				)
			else if (section === 'preferential_quiz')
				answers = (
					<PreferentailAnswers
						questionNumber={index}
						answers={question.answers}
						questionId={question.id}
						finishedData={finishedData}
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

		return (
			<>
				{questionList}

				{Object.keys(finishedData).length === 0 ? (
					<div>
						<div className="card__footer">
							<button className="btn btn__submit">Finish</button>
						</div>
					</div>
				) : null}
			</>
		)
	}
}

export default OnePageQuiz
