import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { getQuizPunctations } from '../../../../redux/actions/quizzes'

import CircleLoader from '../../../../components/loaders/CircleLoader'
import PunctationItem from '../../../../components/quizzes/panel/detail/PunctationItem'

class Punctation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		punctations: PropTypes.array,
	}

	constructor(props) {
		super(props)
		const { punctations } = this.props

		this.state = {
			loading: true,
		}

		this.getPunctations = this.getPunctations.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	getPunctations = async () => {
		const { data } = this.props
		this.setState({ loading: true })

		await this.props.getQuizPunctations(data.author_slug, data.slug)

		this.setState({ loading: false })
	}

	onSubmit = (e) => {
		e.preventDefault()
	}

	componentDidMount = () => this.getPunctations()

	componentDidUpdate(prevProps, _) {
		if (prevProps.data !== this.props.data) this.getPunctations()
	}

	render() {
		const { loading } = this.state
		const { data, punctations } = this.props

		if (!loading && punctations.length === 0)
			return <Redirect to="/not-found" />

		const punctationList = punctations.map((punctation, index) => (
			<div key={index}>
				<PunctationItem
					punctation={punctation}
					section_name={data.section.name}
					max_score={data.max_score}
					nextId={
						punctations.indexOf(punctations[index]) ===
						punctations.length - 1
							? null
							: punctations[index + 1].id
					}
				/>

				<hr />
			</div>
		))

		return (
			<div className="card">
				{loading ? (
					<div className="card__body">
						<CircleLoader />
					</div>
				) : (
					<form onSubmit={this.onSubmit}>{punctationList}</form>
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
