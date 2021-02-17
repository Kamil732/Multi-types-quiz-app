import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Navigation from './Navigation'
import Routes from './Routes'
import CircleLoader from '../../../loaders/CircleLoader'
import { Redirect, withRouter } from 'react-router-dom'

import { getQuiz } from '../../../../redux/actions/quizzes'

class Detail extends Component {
	static propTypes = {
		author_slug: PropTypes.string.isRequired,
		data_loading: PropTypes.bool,
		data: PropTypes.object,
		getQuiz: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
		}

		this.getQuiz = this.getQuiz.bind(this)
	}

	getQuiz = async () => {
		this.setState({ loading: true })
		const { quiz_slug } = this.props.match.params

		await this.props.getQuiz(this.props.author_slug, quiz_slug)
		this.setState({ loading: false })
	}

	componentDidMount = () => this.getQuiz()

	componentDidUpdate(prevProps, _) {
		if (
			prevProps.match.params.quiz_slug !==
			this.props.match.params.quiz_slug
		)
			this.getQuiz()
	}

	render() {
		const { data } = this.props
		const { quiz_slug } = this.props.match.params

		if (this.state.loading) return <CircleLoader />
		else if (Object.keys(data).length === 0)
			return <Redirect to="/not-found" />

		return (
			<>
				<p className="quiz-detail__title">
					{data.title}
					<br />
					<span className="text-darken">created {data.pub_date}</span>
				</p>
				<Navigation quiz_slug={quiz_slug} />

				<Routes data={data} />
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	author_slug: state.auth.user.slug,
	data_loading: state.quizzes.quizzes.loading,
	data: state.quizzes.quizzes.item.data,
})

const mapDispatchToProps = {
	getQuiz,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Detail))
