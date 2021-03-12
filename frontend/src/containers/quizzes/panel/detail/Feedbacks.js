import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from 'axios'
import { refreshToken } from '../../../../redux/actions/auth'
import getAccessToken from '../../../../helpers/getAccessToken'

import Title from '../../../../common/Title'
import FeedbackList from '../../../../components/quizzes/panel/detail/FeedbackList'
import CircleLoader from '../../../../components/loaders/CircleLoader'

class Feedbacks extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		token: PropTypes.string.isRequired,
		refreshToken: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			feedbacks: [],
		}
	}

	componentDidMount = async () => {
		const { data, token } = this.props

		try {
			const config = getAccessToken(token, true)

			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/quizzes/${data.author_slug}/${data.slug}/feedbacks/`,
				config
			)

			this.setState({
				loading: false,
				feedbacks: res.data,
			})
		} catch (err) {
			if (err.response.status === 401) {
				await this.props.refreshToken()

				if (token) await this.componentDidMount()
			} else
				this.setState({
					loading: false,
					feedbacks: [],
				})
		}
	}

	render() {
		const { loading, feedbacks } = this.state

		return (
			<>
				<Title title={`${this.props.data.title} - Feedbacks`} />

				<div className="card">
					<div className="card__body">
						{loading ? (
							<div className="card__body">
								<CircleLoader />
							</div>
						) : (
							<FeedbackList
								data={this.props.data}
								feedbacks={feedbacks}
							/>
						)}
					</div>
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	token: state.auth.token,
})

const mapDispatchToProps = {
	refreshToken,
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedbacks)
