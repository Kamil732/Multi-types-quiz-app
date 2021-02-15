import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from '../../../Textarea'

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

		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => {
		const target = e.target ? e.target : e
		const id = parseInt(target.getAttribute('data-id'))

		const from_score = this.dataRefs[id].from_score
		const to_score = this.dataRefs[id].to_score

		const summery = this.dataRefs[id].summery

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

		// If from_score is greater than to_score
		if (from_score.value > to_score.value)
			// Add 1 to to_score
			to_score.value = parseInt(to_score.value) + 1

		if (this.dataRefs[id + 1]) {
			const next_from_score = this.dataRefs[id + 1].from_score
			const next_to_score = this.dataRefs[id + 1].to_score

			// Add 1 to the next_from_score
			next_from_score.value = parseInt(to_score.value) + 1

			// Set to_score MIN to from_score VALUE
			to_score.min = from_score.value

			if (this.dataRefs[id - 1]) {
				const previous_to_score = this.dataRefs[id - 1].to_score

				// If previous_to_score is greater than or equal to from_score
				if (previous_to_score.value >= from_score.value)
					from_score.value = parseInt(from_score.value) + 1
			}
			// If its first
			// Set the next_from_score
			else next_from_score.value = parseInt(to_score.value) + 1

			// Recursion to validate other inputs
			this.onChange(next_to_score)
		} else {
			// If its the last
			to_score.value = this.props.max_score
		}
	}

	componentDidUpdate(prevProps, _) {
		if (prevProps.punctations !== this.props.punctations) {
			console.log(this.dataRefs[0].to_score)
		}
	}

	setToScoreRef = (element) => (this.toScore = element)

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
							<input
								data-id={index}
								type="number"
								name="from_score"
								className="form-inline__input disabled"
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
							<input
								data-id={index}
								type="number"
								name="to_score"
								className="form-inline__input"
								min={punctation.from_score}
								max={
									punctations[index + 1]
										? punctations[index + 1].to_score - 1
										: this.props.max_score
								}
								onChange={this.onChange}
								defaultValue={punctation.to_score}
								required
								ref={(ref) =>
									(this.dataRefs[index] = {
										...this.dataRefs[index],
										to_score: ref,
									})
								}
							/>
						</div>
					) : null}
					<div className="form-control">
						<label>Description:</label>
						<Textarea
							data-id={index}
							onChange={this.onChange}
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
