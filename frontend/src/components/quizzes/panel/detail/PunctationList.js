import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from '../../../Textarea'

class PunctationList extends Component {
	static propTypes = {
		max_score: PropTypes.number.isRequired,
		section_name: PropTypes.string.isRequired,
		punctations: PropTypes.array,
	}

	constructor(props) {
		super(props)

		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => {
		const target = e.target ? e.target : e

		const id = parseInt(target.getAttribute('data-id'))

		// If from_score is greater than to_score
		if (
			document.getElementById(`from-score-${id}`).value >
			document.getElementById(`to-score-${id}`).value
		)
			// Add 1 to to_score
			document.getElementById(`to-score-${id}`).value =
				parseInt(document.getElementById(`to-score-${id}`).value) + 1

		if (document.getElementById(`from-score-${id + 1}`)) {
			// Add 1 to the next from_score
			document.getElementById(`from-score-${id + 1}`).value =
				parseInt(target.value) + 1

			// Set to_score MIN to from_score VALUE
			document.getElementById(
				`to-score-${id}`
			).min = document.getElementById(`from-score-${id}`).value

			if (document.getElementById(`from-score-${id - 1}`)) {
				// If previous to_score is greater than or equal to target from_score
				if (
					document.getElementById(`to-score-${id - 1}`).value >=
					document.getElementById(`from-score-${id}`).value
				)
					document.getElementById(`from-score-${id}`).value =
						parseInt(
							document.getElementById(`from-score-${id}`).value
						) + 1
			}
			// If its first
			// Set the next from_score
			else
				document.getElementById(`from-score-${id + 1}`).value =
					parseInt(target.value) + 1

			// Recursion to validate other inputs
			this.onChange(document.getElementById(`to-score-${id + 1}`))
		} else {
			// If its the last
			document.getElementById(
				`to-score-${id}`
			).value = this.props.max_score
		}
	}

	render() {
		const { section_name, punctations } = this.props

		return punctations.map((punctation, index) => (
			<div className="card__body" key={index}>
				{section_name === 'knowledge_quiz' ||
				section_name === 'universal_quiz' ? (
					<div className="form-inline">
						<label className="form-inline__label">
							Grand range:
						</label>
						<input
							id={`from-score-${index}`}
							data-id={index}
							type="number"
							name="from_score"
							className="form-inline__input disabled"
							defaultValue={punctation.from_score}
							readOnly
						/>
						<input
							id={`to-score-${index}`}
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
						/>
					</div>
				) : null}
				<div className="form-control">
					<label>Description:</label>
					<Textarea
						id={`description-${index}`}
						data-id={index}
						onChange={this.onChange}
						name="description"
						className="form-control__input form-control__textarea"
						placeholder="Pass the description..."
						rows="3"
					/>
				</div>
			</div>
		))
	}
}

export default PunctationList
