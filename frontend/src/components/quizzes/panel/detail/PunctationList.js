import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from '../../../Textarea'

import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'

import objectsEquals from '../../../../helpers/objectsEquals'
class PunctationList extends Component {
	static propTypes = {
		max_score: PropTypes.number.isRequired,
		section_name: PropTypes.string.isRequired,
		punctations: PropTypes.array,
		hasChanged: PropTypes.func,
	}

	constructor(props) {
		super(props)

		this.data = Object.values(this.props.punctations)
		this.dataRefs = []

		this.recalculateRatings = this.recalculateRatings.bind(this)
		this.hasChanged = this.hasChanged.bind(this)
		this.setInput = this.setInput.bind(this)
	}

	recalculateRatings() {
		const { max_score } = this.props

		const shown = this.dataRefs.length
		let expectedFrom = 0

		for (let i = 0; i < shown; i++) {
			const { from_score, to_score } = this.dataRefs[i]

			from_score.value = expectedFrom
			let expectedTo = parseInt(to_score.value)

			if (expectedTo < expectedFrom) {
				expectedTo = expectedFrom
				to_score.value = expectedTo
			}

			expectedFrom = expectedTo + 1
			if (expectedFrom > max_score) expectedFrom = max_score
		}

		let expectedTo = max_score
		for (let i = shown - 1; i >= 0; --i) {
			const { from_score, to_score } = this.dataRefs[i]

			to_score.value = expectedTo
			let expectedFrom = parseInt(from_score.value)
			if (expectedFrom > expectedTo) {
				expectedFrom = expectedTo
				from_score.value = expectedFrom
			}

			expectedTo = expectedFrom - 1 >= 0 ? expectedFrom - 1 : 0
		}
	}

	hasChanged = () => {
		const { hasChanged, punctations, section_name, max_score } = this.props

		// Set the hasChanged
		if (hasChanged) {
			const sectionKnowledgeOrUniversal =
				section_name === 'knowledge_quiz' ||
				section_name === 'universal_quiz'
			// Update data
			for (let i = 0; i < this.dataRefs.length; i++)
				this.data[i] = {
					summery: this.dataRefs[i].summery.value(), // .value() is function because summery is component
					from_score: sectionKnowledgeOrUniversal
						? parseInt(this.dataRefs[i].from_score.value)
						: 0,
					to_score: sectionKnowledgeOrUniversal
						? parseInt(this.dataRefs[i].to_score.value)
						: max_score,
				}

			// array of booleans, true if object has change otherwise false
			const hasChangedArray = this.data.map(
				(_, index) =>
					!objectsEquals(punctations[index], this.data[index])
			)

			// If true in array than the form has changed
			hasChanged(
				hasChangedArray.some((hasChanged) => hasChanged === true)
			)
		}
	}

	componentDidUpdate(prevProps, _) {
		if (prevProps.punctations.length !== this.props.punctations.length) {
			if (prevProps.punctations.length > this.props.punctations.length) {
				// Delete unnecessary data
				for (
					let i = 0;
					i <
					prevProps.punctations.length -
						this.props.punctations.length;
					i++
				) {
					this.dataRefs.pop()
					this.data.pop()
				}
			}

			this.recalculateRatings()
		}
	}

	setInput = (e, index, add = true) => {
		e.preventDefault()

		const to_score = this.dataRefs[index].to_score

		to_score.value = add
			? parseInt(to_score.value) + 1
			: parseInt(to_score.value) - 1

		this.recalculateRatings()
		this.hasChanged()
	}

	render() {
		const { section_name, punctations } = this.props

		const punctationList = punctations.map((punctation, index) => (
			<div key={index}>
				<div className="card__body">
					{section_name === 'knowledge_quiz' ||
					section_name === 'universal_quiz' ? (
						<div className="form-inline">
							<label className="form-inline__label">
								Grand range:
							</label>
							<div className="number-field">
								<input
									id={`from-score-${index}`}
									data-id={index}
									type="text"
									name="from_score"
									className="form-inline__input number-field__input"
									defaultValue={punctation.from_score}
									readOnly
									required
									ref={(ref) =>
										(this.dataRefs[index] = {
											...this.dataRefs[index],
											from_score: ref,
										})
									}
								/>
							</div>
							<div className="number-field">
								<input
									id={`to-score-${index}`}
									data-id={index}
									type="text"
									name="to_score"
									className="form-inline__input number-field__input"
									ref={(ref) =>
										(this.dataRefs[index] = {
											...this.dataRefs[index],
											to_score: ref,
										})
									}
									defaultValue={punctation.to_score}
									required
									readOnly
								/>
								<div className="number-field__btns">
									<button
										className="number-field__btn"
										onClick={(e) =>
											this.setInput(e, index, true)
										}
									>
										<IoMdArrowDropup />
									</button>
									<button
										className="number-field__btn"
										onClick={(e) =>
											this.setInput(e, index, false)
										}
									>
										<IoMdArrowDropdown />
									</button>
								</div>
							</div>
						</div>
					) : null}
					<div className="form-control">
						<label className="form-control__label">Summery:</label>
						<Textarea
							id={`summery-${index}`}
							data-id={index}
							onChange={this.hasChanged}
							name="summery"
							defaultValue={punctation.summery}
							className="form-control__input form-control__textarea"
							placeholder="Pass the description..."
							rows="3"
							required
							ref={(ref) =>
								(this.dataRefs[index] = {
									...this.dataRefs[index],
									summery: ref,
								})
							}
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
