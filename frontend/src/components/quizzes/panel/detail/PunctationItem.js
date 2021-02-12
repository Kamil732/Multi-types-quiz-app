import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from '../../../Textarea'

class PunctationItem extends Component {
	static propTypes = {
		max_score: PropTypes.number.isRequired,
		section_name: PropTypes.string.isRequired,
		punctation: PropTypes.object.isRequired,
		nextId: PropTypes.number,
	}

	constructor(props) {
		super(props)
		const { punctation } = this.props

		this.state = {
			from_score: punctation.from_score,
			to_score: punctation.to_score,
			description: punctation.summery,
		}

		this.onChange = this.onChange.bind(this)
	}

	onChange = (e) => {
		if (this.props.nextId) {
			const from_score = document.getElementById(
				`from-score-${this.props.nextId}`
			)
			const to_score = document.getElementById(
				`to-score-${this.props.nextId}`
			)

			// Add 1 to next from-score
			from_score.value = parseInt(e.target.value) + 1

			// Add 1 to next form-score min
			to_score.min = parseInt(e.target.value) + 1

			// Add 1 to next form-score max
			to_score.max = parseInt(e.target.max) + 1

			// If while adding in previous to_score the next from_score is greater than next to_score then add 1 to to_score
			if (from_score.value > to_score.value)
				to_score.value = parseInt(e.target.value) + 1
		} else e.target.value = this.props.max_score

		this.setState({ [e.target.name]: e.target.value })
	}

	render() {
		const { section_name, punctation } = this.props
		const { from_score, to_score, description } = this.state

		return (
			<div className="card__body">
				{section_name === 'knowledge_quiz' ||
				section_name === 'universal_quiz' ? (
					<div className="form-inline">
						<label className="form-inline__label">
							Grand range:
						</label>
						<input
							id={`from-score-${punctation.id}`}
							type="number"
							name="from_score"
							className="form-inline__input disabled"
							defaultValue={from_score}
							disabled
						/>
						<input
							id={`to-score-${punctation.id}`}
							type="number"
							name="to_score"
							className="form-inline__input"
							min={punctation.from_score}
							max={punctation.to_score}
							onChange={this.onChange}
							value={to_score}
						/>
					</div>
				) : null}
				<div className="form-control">
					<label>Description:</label>
					<Textarea
						id={`description-${punctation.id}`}
						onChange={this.onChange}
						value={description}
						name="description"
						className="form-control__input form-control__textarea"
						placeholder="Pass the description..."
						rows="3"
					/>
				</div>
			</div>
		)
	}
}

export default PunctationItem
