import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import {
	getQuizPunctations,
	updatePunctations,
} from '../../../../../redux/actions/quizzes'
import { clearErrors } from '../../../../../redux/actions/errors'

import Title from '../../../../../common/Title'
import CircleLoader from '../../../../../components/loaders/CircleLoader'
import PunctationList from '../../../../../components/quizzes/panel/detail/edit/PunctationList'

class Punctation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		punctations: PropTypes.array,
		errors: PropTypes.object,
		getQuizPunctations: PropTypes.func.isRequired,
		updatePunctations: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired,
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

		this.props.clearErrors()
		this.setState({
			punctations,
			hasChanged: false,
		})
	}

	addGrade = () => {
		const section_name = this.props.data.section.name
		const { punctations } = this.state

		if (
			section_name !== 'psychology_quiz' &&
			punctations.length - 1 < this.props.data.max_score
		)
			this.setState({
				hasChanged: true,
				punctations: [
					...punctations,
					{
						result: '',
						description: '',
						from_score: this.props.data.max_score,
						to_score: this.props.data.max_score,
					},
				],
			})
		else
			this.setState({
				hasChanged: true,
				punctations: [
					...punctations,
					{
						result: '',
						description: '',
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

	onSubmit = async (e) => {
		e.preventDefault()

		let data = []

		for (let i = 0; i < this.state.punctations.length; i++) {
			const { section, max_score } = this.props.data
			const sectionKnowledgeOrUniversal =
				section.name === 'knowledge_quiz' ||
				section.name === 'universal_quiz'

			if (section === 'psychology_quiz')
				data.push({
					result: document.getElementById(`result-${i}`).value,
					description: document.getElementById(`description-${i}`)
						.value,
				})
			else
				data.push({
					from_score: sectionKnowledgeOrUniversal
						? parseInt(
								document.getElementById(`from-score-${i}`).value
						  )
						: 0,
					to_score: sectionKnowledgeOrUniversal
						? parseInt(
								document.getElementById(`to-score-${i}`).value
						  )
						: max_score,
					result: document.getElementById(`result-${i}`).value,
					description: document.getElementById(`description-${i}`)
						.value,
				})
		}

		await this.props.clearErrors()
		await this.props.updatePunctations(
			data,
			this.props.data.author_slug,
			this.props.data.slug
		)

		if (Object.keys(this.props.errors).length === 0)
			this.setState({ hasChanged: false })
	}

	componentDidMount = () => this.getPunctations()

	componentDidUpdate(prevProps, _) {
		if (prevProps.data !== this.props.data) this.getPunctations()
	}

	componentWillUnmount = () => this.props.clearErrors()

	render() {
		const { loading, hasChanged, punctations } = this.state
		const { data, errors } = this.props
		const section_name = data.section.name

		if (!loading && Object.keys(data).length === 0)
			return <Redirect to="/not-found" />

		return (
			<>
				<Title title={`${this.props.data.title} - Punctation`} />

				<div className="card">
					{loading ? (
						<div className="card__body">
							<CircleLoader />
						</div>
					) : (
						<form onSubmit={this.onSubmit}>
							<PunctationList
								punctations={punctations}
								section_name={section_name}
								max_score={data.max_score}
								hasChanged={(state) =>
									this.setState({ hasChanged: state })
								}
							/>

							<div className="card__body">
								{section_name !== 'preferential_quiz' ? (
									<>
										<div className="inline-btns">
											<button
												type="button"
												className={`btn ${
													section_name !==
														'psychology_quiz' &&
													punctations.length - 1 >=
														this.props.data
															.max_score
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
									</>
								) : null}

								{errors.detail ? (
									<div className="message-box error">
										<p className="message-box__text">
											{errors.detail}
										</p>
									</div>
								) : null}
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
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	punctations: state.quizzes.quizzes.item.punctations,
	errors: state.errors.messages,
})

const mapDispatchToProps = {
	getQuizPunctations,
	updatePunctations,
	clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(Punctation)
