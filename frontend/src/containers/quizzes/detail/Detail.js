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
					{isOwner ? (
						<div className="card__footer">
							<Link to={`/panel/dashboard/${data.slug}/summery`}>
								<button className="btn btn__submit">
									Edit as an admin
								</button>
							</Link>
						</div>
					) : null}
				</div>
				<div className="card__footer">
					<Link to={`/quizzes/${author_slug}/${data.slug}/start`}>
						<button className="btn btn__submit btn__contrast">
							START
						</button>
					</Link>
				</div>
			</>
		)
	}
}

export default Detail
