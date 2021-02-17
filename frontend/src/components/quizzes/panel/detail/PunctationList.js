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

		this.recalculateAddedRatings = this.recalculateAddedRatings.bind(this)
		this.recalculateDeletedRatings = this.recalculateDeletedRatings.bind(
			this
		)
		this.recalculateRatings = this.recalculateRatings.bind(this)
	}

	recalculateAddedRatings = (index = this.dataRefs.length - 1) => {
		const to_score = this.dataRefs[index].to_score
		const from_score = this.dataRefs[index].from_score

		if (from_score.value > to_score.value)
			// Minus 1 from from_score
			from_score.value = parseInt(from_score.value) - 1

		if (this.dataRefs[index - 1]) {
			const previous_to_score = this.dataRefs[index - 1].to_score

			// Set previous_to_score to from_score minus 1
			previous_to_score.value = parseInt(from_score.value) - 1

			// Set to_score MIN to from_score
			to_score.min = from_score.value

			// Set previous_to_score MAX to to_score minus 1
			previous_to_score.max = parseInt(to_score.value) - 1

			// Recursion to validate other inputs
			this.recalculateAddedRatings(index - 1)
		}
	}

	recalculateDeletedRatings = (index = this.dataRefs.length - 1) => {
		const to_score = this.dataRefs[index].to_score
		const from_score = this.dataRefs[index].from_score

		// Add 1 to to_score
		to_score.value = parseInt(to_score.value) + 1

		if (from_score.value > to_score.value)
			// minus 1 from from_score
			from_score.value = parseInt(from_score.value) - 1

		if (this.dataRefs[index - 1]) {
			const previous_to_score = this.dataRefs[index - 1].to_score
			const previous_from_score = this.dataRefs[index - 1].from_score

			if (from_score.value > previous_to_score.value)
				// Minus 1 from previous_to_score
				previous_to_score.value = parseInt(previous_to_score.value) - 1

			// Set to_score MIN to from_score VALUE
			to_score.min = from_score.value

			if (previous_to_score.value >= from_score.value)
				// Set previous_from_score to previous_from_score minus 1
				previous_from_score.value =
					parseInt(previous_from_score.value) - 1

			// Recursion to validate other inputs
			this.recalculateDeletedRatings(index - 1)
		}

		if (this.dataRefs[index + 1]) {
			const next_to_score = this.dataRefs[index + 1].to_score
			const next_from_score = this.dataRefs[index + 1].from_score

			// Set to_score MAX to next_to_score MAX
			to_score.max =
				next_to_score.value === next_from_score.value
					? parseInt(next_to_score.max)
					: parseInt(next_to_score.max) - 1
		} else {
			// Its the last
			to_score.value = this.props.max_score
			to_score.max = this.props.max_score
		}
	}

	componentDidUpdate(prevProps, _) {
		if (prevProps.punctations.length < this.props.punctations.length)
			this.recalculateAddedRatings()
		else if (prevProps.punctations.length > this.props.punctations.length) {
			// Delete unnecessary data
			for (
				let i = 0;
				i <
				prevProps.punctations.length - this.props.punctations.length;
				i++
			) {
				this.dataRefs.pop()
				this.data.pop()
			}

			this.recalculateDeletedRatings()
		}
	}

	recalculateRatings = (e) => {
		const target = e.target ? e.target : e
		const id = parseInt(target.getAttribute('data-id'))

		const from_score = this.dataRefs[id].from_score
		const to_score = this.dataRefs[id].to_score

		const summery = this.dataRefs[id].summery

		// Set the hasChanged
		if (this.props.hasChanged) {
			// Update data
			this.data[id] = {
				from_score: parseInt(from_score.value),
				to_score: parseInt(to_score.value),
				summery: summery.value,
			}

			// array of booleans, true if object has change otherwise false
			const hasChangedArray = this.data.map(
				(_, index) =>
					!objectsEquals(
						this.props.punctations[index],
						this.data[index]
					)
			)

			// If true in array than the form has changed
			this.props.hasChanged(
				hasChangedArray.some((hasChanged) => hasChanged === true)
			)
		}

		if (from_score.value > to_score.value)
			// Add 1 to to_score
			to_score.value = parseInt(to_score.value) + 1

		if (this.dataRefs[id + 1]) {
			const next_from_score = this.dataRefs[id + 1].from_score
			const next_to_score = this.dataRefs[id + 1].to_score

			// Set next_from_score to to_score plus 1
			next_from_score.value = parseInt(to_score.value) + 1

			// Set to_score MIN to from_score VALUE
			to_score.min = from_score.value

			// Set to_score MAX to next_to_score MAX minus 1
			to_score.max = parseInt(next_to_score.max) - 1

			if (this.dataRefs[id - 1]) {
				const previous_to_score = this.dataRefs[id - 1].to_score

				// If previous_to_score is greater than or equal to from_score then add 1 to form_score
				if (previous_to_score.value >= from_score.value)
					from_score.value = parseInt(from_score.value) + 1
			}

			// Recursion to validate other inputs
			this.recalculateRatings(next_to_score)
		} else {
			// If its the last
			to_score.value = this.props.max_score
			to_score.max = this.props.max_score
		}
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
									min={punctation.from_score}
									max={
										punctations[index + 1]
											? punctations[index + 1].to_score -
											  1
											: this.props.max_score
									}
									defaultValue={punctation.to_score}
									required
									readOnly
									ref={(ref) =>
										(this.dataRefs[index] = {
											...this.dataRefs[index],
											to_score: ref,
										})
									}
								/>
								<div className="number-field__btns">
									<button
										className="number-field__btn"
										onClick={(e) => {
											e.preventDefault()

											const to_score = this.dataRefs[
												index
											].to_score

											if (to_score.value < to_score.max)
												to_score.value =
													parseInt(to_score.value) + 1

											this.recalculateRatings(to_score)
										}}
									>
										<IoMdArrowDropup />
									</button>
									<button
										className="number-field__btn"
										onClick={(e) => {
											e.preventDefault()

											const to_score = this.dataRefs[
												index
											].to_score

											if (to_score.value > to_score.min)
												to_score.value =
													parseInt(to_score.value) - 1

											this.recalculateRatings(to_score)
										}}
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
							onChange={this.recalculateRatings}
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
