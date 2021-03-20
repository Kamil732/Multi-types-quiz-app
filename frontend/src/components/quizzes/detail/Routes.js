import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import CircleLoader from '../../loaders/CircleLoader'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import { getQuiz } from '../../../redux/actions/quizzes'

import Start from '../../../containers/quizzes/detail/Start'
import Detail from '../../../containers/quizzes/detail/Detail'
import AboutUser from '../../accounts/profile/AboutUser'
import Ad from '../../Ad'

class Routes extends Component {
	static propTypes = {
		data: PropTypes.object,
		user_loading: PropTypes.bool,
		user_slug: PropTypes.string,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			isOwner: false,
		}

		this.getQuiz = this.getQuiz.bind(this)
	}

	getQuiz = async () => {
		this.setState({ loading: true })
		const { author_slug, quiz_slug } = this.props.match.params

		await this.props.getQuiz(author_slug, quiz_slug)
		this.setState({
			loading: false,
			isOwner: author_slug === this.props.user_slug,
		})
	}

	componentDidMount = () => this.getQuiz()

	componentDidUpdate(prevProps, _) {
		if (
			prevProps.match.params.author_slug !==
				this.props.match.params.author_slug ||
			prevProps.match.params.quiz_slug !==
				this.props.match.params.quiz_slug
		)
			this.getQuiz()
		if (prevProps.user_slug !== this.props.user_slug)
			this.setState({
				isOwner:
					this.props.match.params.author_slug ===
					this.props.user_slug,
			})
	}

	render() {
		const { data } = this.props
		const { author_slug } = this.props.match.params
		const { loading, isOwner } = this.state

		if (loading === true) return <CircleLoader />
		else if (Object.keys(data).length === 0)
			return <Redirect to="/not-found" />

		return (
			<div className="row">
				<div className="col col-sm-9">
					<Switch>
						<Route
							exact
							path="/quizzes/:author_slug/:quiz_slug"
							component={() => (
								<Detail
									isOwner={isOwner}
									author_slug={author_slug}
									data={data}
								/>
							)}
						/>
						<Route
							exact
							path="/quizzes/:author_slug/:quiz_slug/start"
							component={() => (
								<Start
									isOwner={isOwner}
									author_slug={author_slug}
									data={data}
								/>
							)}
						/>

						<Redirect to="/not-found" />
					</Switch>
				</div>
				<div className="col col-sm-3">
					<AboutUser accountUrl={data.author} />
					<Ad />
				</div>
			</div>
		)
	}
}

const mapStateTopProps = (state) => ({
	user_loading: state.auth.loading,
	user_slug: state.auth.user.slug,
	data: state.quizzes.quizzes.item.data,
})

const mapDispatchToProps = {
	getQuiz,
}

export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Routes))
