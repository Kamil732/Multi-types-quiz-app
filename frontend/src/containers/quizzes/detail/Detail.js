import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Title from '../../../common/Title'
import FacebookShare from '../../../components/social_media/FacebookShare'
import TwitterShare from '../../../components/social_media/TwitterShare'
import { Link } from 'react-router-dom'

class Detail extends Component {
	static propTypes = {
		author_slug: PropTypes.string.isRequired,
		isOwner: PropTypes.bool,
		data: PropTypes.object.isRequired,
	}

	render() {
		const { isOwner, data, author_slug } = this.props

		return (
			<>
				<Title title={`Quiz Detail ${data.title}`} />

				<div className="card__header">{data.title}</div>
				<div className="card">
					<div className="card__body">
						<div className="quiz-detail">
							<img
								className="quiz-detail__img"
								src={data.image_url}
								alt={data.title}
							/>
							{data.description}
						</div>
					</div>

					<hr />

					<div className="card__body share-items">
						<FacebookShare
							url={window.location.href}
							quote={data.title}
							image_url={data.image_url}
						/>
						<TwitterShare
							url={window.location.href}
							title={data.title}
						/>
					</div>
				</div>

				{data.question_amount === 0 ? (
					<div className="message-box info">
						<span className="message-box__text">
							You can't solve this quiz, because it has no
							questions
						</span>
					</div>
				) : null}

				<div className="card__footer inline-btns f-w">
					{isOwner ? (
						<Link to={`/panel/dashboard/${data.slug}/summery`}>
							<button className="btn btn__submit">
								Edit as an admin
							</button>
						</Link>
					) : null}
					<Link to={`/quizzes/${author_slug}/${data.slug}/start`}>
						<button
							className={`btn btn__submit btn__contrast ${
								data.question_amount === 0
									? 'btn__disabled'
									: ''
							}`}
						>
							START
						</button>
					</Link>
				</div>
			</>
		)
	}
}

export default Detail
