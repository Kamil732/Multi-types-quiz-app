import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from 'axios'
import { refreshToken } from '../../../../redux/actions/auth'
import getAccessToken from '../../../../helpers/getAccessToken'

import Swal from 'sweetalert2'
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

		this.deleteFeedback = this.deleteFeedback.bind(this)
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

	deleteFeedback = (index, feedbackId) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'Are you sure you want to delete this feedback?',
			icon: 'warning',
			showCancelButton: true,
			customClass: {
				confirmButton: 'btn btn__danger',
				cancelButton: 'btn',
			},
			buttonsStyling: false,
			confirmButtonText: 'delete',
		}).then(async (res) => {
			if (res.isConfirmed) {
				const { data, token } = this.props

				const config = getAccessToken(token, true)

				try {
					await axios.delete(
						`${process.env.REACT_APP_API_URL}/quizzes/${data.author_slug}/${data.slug}/feedbacks/${feedbackId}/`,
						config
					)

					const feedbacks = Array.from(this.state.feedbacks)
					feedbacks.splice(index, 1)

					this.setState({ feedbacks })
				} catch (err) {
					if (err.response.status === 401) {
						await this.props.deleteFeedback(index)

						if (token) await this.componentDidMount()
					} else
						Swal.fire(
							'The error has occurred',
							'The error occurred while deleting the feedback, try again',
							'error'
						)
				}
			}
		})
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
								deleteFeedback={this.deleteFeedback}
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
