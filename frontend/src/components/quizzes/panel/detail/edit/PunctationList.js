import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from '../../../../Textarea'

import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'

class PunctationList extends Component {
	static propTypes = {
		max_score: PropTypes.number.isRequired,
		section_name: PropTypes.string.isRequired,
		punctations: PropTypes.array,
		setPunctations: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.recalculateRatings = this.recalculateRatings.bind(this)
		this.onChange = this.onChange.bind(this)
		this.setInput = this.setInput.bind(this)
	}

	onChange = (e) => {
		const punctations = this.props.punctations.map((punctation, index) => {
			if (index === parseInt(e.target.getAttribute('data-id'))) {
				return {
					...punctation,
					[e.target.name]: e.target.value,
				}
			}

			return punctation
		})

		this.props.setPunctations(punctations)
	}

	recalculateRatings(punctations) {
		const { max_score } = this.props
		const shown = punctations.length
		let expectedFrom = 0

		for (let i = 0; i < shown; i++) {
			const { to_score } = punctations[i]

			// eslint-disable-next-line
			punctations = punctations.map((punctation, index) => {
				if (index === i)
					return {
						...punctation,
						from_score: expectedFrom,
					}

				return punctation
			})
			let expectedTo = to_score

			if (expectedTo < expectedFrom) {
				expectedTo = expectedFrom

				punctations = punctations.map((punctation, index) => {
					if (index === i)
						return {
							...punctation,
							to_score: expectedTo,
						}

					return punctation
				})
			}

			expectedFrom = expectedTo + 1
			if (expectedFrom > max_score) expectedFrom = max_score
		}

		let expectedTo = max_score
		for (let i = shown - 1; i >= 0; --i) {
			const { from_score } = punctations[i]
			// eslint-disable-next-line
			punctations = punctations.map((punctation, index) => {
				if (index === i)
					return {
						...punctation,
						to_score: expectedTo,
					}

				return punctation
			})

			let expectedFrom = from_score
			if (expectedFrom > expectedTo) {
				expectedFrom = expectedTo

				punctations = punctations.map((punctation, index) => {
					if (index === i)
						return {
							...punctation,
							from_score: expectedFrom,
						}

					return punctation
				})
			}

			expectedTo = expectedFrom - 1 >= 0 ? expectedFrom - 1 : 0
		}

		this.props.setPunctations(punctations)
	}

	componentDidUpdate(prevProps, _) {
		if (
			prevProps.punctations.length !== this.props.punctations.length &&
			this.props.section_name !== 'psychology_quiz'
		)
			this.recalculateRatings(this.props.punctations)
	}

	setInput = (index, add) =>
		this.recalculateRatings(
			this.props.punctations.map((punctation, index_) => {
				if (index_ === index) {
					return {
						...punctation,
						to_score: this.props.punctations[index].to_score + add,
					}
				}

				return punctation
			})
		)

	render() {
		const { section_name, punctations } = this.props

		const punctationList = punctations.map((punctation, index) => (
			<div key={index}>
				<input
					type="hidden"
					value={punctation.id || ''}
					id={`punctation-id-${index}`}
				/>

				<div className="card__body">
					{section_name === 'knowledge_quiz' ||
					section_name === 'universal_quiz' ? (
						<div className="form-inline">
							<label className="form-inline__label">
								Point scope:
							</label>
							<div className="number-field">
								<input
									id={`from-score-${index}`}
									data-id={index}
									type="text"
									name="from_score"
									className="form-inline__input number-field__input"
									value={punctation.from_score}
									onChange={this.onChange}
									readOnly
									required
								/>
							</div>
							<div className="number-field">
								<input
									id={`to-score-${index}`}
									data-id={index}
									type="text"
									name="to_score"
									className="form-inline__input number-field__input"
									value={punctation.to_score}
									required
									readOnly
								/>
								<div className="number-field__btns">
									<button
										type="button"
										className="number-field__btn"
										onClick={() => this.setInput(index, 1)}
									>
										<IoMdArrowDropup />
									</button>
									<button
										type="button"
										className="number-field__btn"
										onClick={() => this.setInput(index, -1)}
									>
										<IoMdArrowDropdown />
									</button>
								</div>
							</div>
						</div>
					) : null}

					<div className="form-control">
						<label className="form-control__label">Result:</label>
						<input
							type="text"
							id={`result-${index}`}
							data-id={index}
							onChange={this.onChange}
							name="result"
							className="form-control__input"
							value={punctation.result}
							maxLength="100"
							required
						/>
					</div>

					<div className="form-control">
						<label className="form-control__label">
							Description:
						</label>
						<Textarea
							id={`description-${index}`}
							data-id={index}
							onChange={this.onChange}
							name="description"
							value={punctation.description}
							className="form-control__input form-control__textarea"
							placeholder="Pass the description..."
							rows="3"
							required
						/>
					</div>
				</div>
				<hr />
			</div>
		))

		return punctationList
	}
}

export default PunctationList
