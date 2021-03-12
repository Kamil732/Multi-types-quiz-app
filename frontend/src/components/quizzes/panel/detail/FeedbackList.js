import React, { Component } from 'react'
import PropTypes from 'prop-types'

class FeedbackList extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		feedbacks: PropTypes.array,
	}

	render() {
		const { feedbacks } = this.props

		const feedbackList = feedbacks.map((feedback, index) => (
			<tr key={index}>
				<td className="numbers">{index + 1}</td>
				<td>
					{feedback.name ? (
						<>
							Name: {feedback.name} <br />
						</>
					) : null}
					{feedback.email ? (
						<>
							Email: {feedback.email} <br />
						</>
					) : null}
					{feedback.gender ? (
						<>
							Gender: {feedback.gender} <br />
						</>
					) : null}
				</td>
				<td className="numbers">{feedback.pub_date}</td>
				<td className="numbers">{feedback.score}</td>
				<td>{feedback.opinion}</td>
			</tr>
		))

		return (
			<div style={{ overflowX: 'auto' }}>
				<table className="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Data</th>
							<th scope="col">Date</th>
							<th scope="col">Score</th>
							<th scope="col">Opinion</th>
						</tr>
					</thead>
					<tbody>
						{feedbackList.length > 0 ? (
							feedbackList
						) : (
							<td colSpan="5" style={{ textAlign: 'center' }}>
								<h2>There are no feedbacks</h2>
							</td>
						)}
					</tbody>
				</table>
			</div>
		)
	}
}

export default FeedbackList
