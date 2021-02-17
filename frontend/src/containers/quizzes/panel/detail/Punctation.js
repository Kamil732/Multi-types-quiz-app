import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
	getQuizPunctations,
	updatePunctations,
} from '../../../../redux/actions/quizzes'

import CircleLoader from '../../../../components/loaders/CircleLoader'
import PunctationList from '../../../../components/quizzes/panel/detail/PunctationList'

class Punctation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		punctations: PropTypes.array,
		getQuizPunctations: PropTypes.func.isRequired,
		updatePunctations: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			punctations: props.punctations,
			hasChanged: false,
		}

		this.getPunctations = this.getPunctations.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.addGrade = this.addGrade.bind(this)
		this.removeGrade = this.removeGrade.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (
			prevState.hasChanged === false &&
			prevState.punctations !== nextProps.punctations
		)
			return {
				punctations: nextProps.punctations,
			}

		return null
	}

	getPunctations = async () => {
		const { data } = this.props
		this.setState({ loading: true })

		await this.props.getQuizPunctations(data.author_slug, data.slug)

		this.setState({ loading: false })
	}

	resetForm = () => {
		const { punctations } = this.props

		this.setState({
			punctations,
			hasChanged: false,
		})
	}

	addGrade = () => {
		const { punctations } = this.state

		if (punctations.length - 1 < this.props.data.max_score)
			this.setState({
				hasChanged: true,
				punctations: [
					...punctations,
					{
						summery: '',
						from_score: this.props.data.max_score,
						to_score: this.props.data.max_score,
					},
				],
			})
	}

	removeGrade = () => {
		const { punctations } = this.state

		if (punctations.length > 1)
			this.setState({
				hasChanged: true,
				punctations: punctations.slice(0, -1),
			})
	}

	onSubmit = (e) => {
		e.preventDefault()

		let data = []

		for (let i = 0; i < this.state.punctations.length; i++) {
			const from_score = parseInt(
				document.getElementById(`from-score-${i}`).value
			)
			const to_score = parseInt(
				document.getElementById(`to-score-${i}`).value
			)
			const summery = document.getElementById(`summery-${i}`).value

			data.push({
				from_score,
				to_score,
				summery,
			})
		}

		this.props.updatePunctations(
			data,
			this.props.data.author_slug,
			this.props.data.slug
		)

		this.setState({ hasChanged: false })
	}

	componentDidMount = () => this.getPunctations()

	componentDidUpdate(prevProps, _) {
		if (prevProps.data !== this.props.data) this.getPunctations()
	}

	render() {
		const { loading, hasChanged, punctations } = this.state
		const { data } = this.props

		if (!loading && Object.keys(data).length === 0)
			return <Redirect to="/not-found" />

		return (
			<div className="card">
				{loading ? (
					<div className="card__body">
						<CircleLoader />
					</div>
				) : (
					<form onSubmit={this.onSubmit}>
						<PunctationList
							punctations={punctations}
							section_name={data.section.name}
							max_score={data.max_score}
							hasChanged={(state) =>
								this.setState({ hasChanged: state })
							}
						/>

						<div className="card__body">
							<div className="inline-btns">
								<button
									type="button"
									className={`btn ${
										punctations.length - 1 >=
										this.props.data.max_score
											? 'btn__disabled'
											: ''
									}`}
									onClick={this.addGrade}
								>
									Add Grade
								</button>
								<button
									type="button"
									className={`btn btn__danger ${
										punctations.length <= 1
											? 'btn__disabled'
											: ''
									}`}
									onClick={this.removeGrade}
								>
									Remove Grade
								</button>
							</div>
							<br /> <br />
							<div className="inline-btns f-w">
								<button
									type="reset"
									onClick={this.resetForm}
									className={`btn ${
										!hasChanged ? 'btn__disabled' : ''
									}`}
								>
									Cancel
								</button>
								<button
									type="submit"
									className={`btn btn__contrast ${
										!hasChanged ? 'btn__disabled' : ''
									}`}
								>
									Save
								</button>
							</div>
						</div>
					</form>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	punctations: state.quizzes.quizzes.item.punctations,
})

const mapDispatchToProps = {
	getQuizPunctations,
	updatePunctations,
}

export default connect(mapStateToProps, mapDispatchToProps)(Punctation)
