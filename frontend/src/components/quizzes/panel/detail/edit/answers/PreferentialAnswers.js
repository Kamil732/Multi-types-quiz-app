import React from 'react'

import { MdQuestionAnswer } from 'react-icons/md'

import Answer from './Answer'

class PreferentialAnswers extends Answer {
	render() {
		const { hasChanged } = this.state

		const answers = this.props.answers.map((answer, index) => (
			<div className="form-control" key={index}>
				<label className="form-control__label">
					Answer {index + 1}
				</label>
				<div className="icon-form">
					<span className="icon">
						<MdQuestionAnswer />
					</span>

					<input
						type="text"
						data-id={index}
						onChange={this.onChangeTextField}
						name="answer"
						value={this.props.answers[index].answer}
						className="form-control__input"
						placeholder={`Pass the ${index + 1} answer...`}
						maxLength="100"
						required
					/>
				</div>
			</div>
		))

		return (
			<div className="card">
				<div className="card__body">
					{answers}

					<hr />
					<div className="card__body">
						<div className="inline-btns">
							<button
								type="button"
								className={`btn ${
									answers.length >= 8 ? 'btn__disabled' : ''
								}`}
								onClick={this.addAnswer}
							>
								Add Answer
							</button>
							<button
								type="button"
								className={`btn btn__danger ${
									answers.length <= 2 ? 'btn__disabled' : ''
								}`}
								onClick={this.removeAnswer}
							>
								Remove Answer
							</button>
						</div>
						<br /> <br />
						<button
							type="reset"
							onClick={this.resetForm}
							className={`btn ${
								!hasChanged ? 'btn__disabled' : ''
							}`}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	}
}

export default PreferentialAnswers
