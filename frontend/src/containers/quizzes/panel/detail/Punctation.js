import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { getQuizPunctations } from '../../../../redux/actions/quizzes'

import CircleLoader from '../../../../components/loaders/CircleLoader'
import PunctationList from '../../../../components/quizzes/panel/detail/PunctationList'

class Punctation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		punctations: PropTypes.array,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			hasChanged: false,
		}

		this.getPunctations = this.getPunctations.bind(this)
		this.resetForm = this.resetForm.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	getPunctations = async () => {
		const { data } = this.props
		this.setState({ loading: true })

		await this.props.getQuizPunctations(data.author_slug, data.slug)

		this.setState({ loading: false })
	}

	resetForm = () => {
		const { data } = this.props
		this.props.getQuizPunctations(data.author_slug, data.slug)

		this.setState({ hasChanged: false })
	}

	onSubmit = (e) => {
		e.preventDefault()
	}

	componentDidMount = () => this.getPunctations()

	componentDidUpdate(prevProps, _) {
		if (prevProps.data !== this.props.data) this.getPunctations()
	}

	render() {
		const { loading, hasChanged } = this.state
		const { data, punctations } = this.props

		if (!loading && punctations.length === 0)
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
								<button className="btn">Add Grade</button>
								<button className="btn btn__danger">
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Punctation)
