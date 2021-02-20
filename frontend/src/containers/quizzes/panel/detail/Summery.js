import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Title from '../../../../common/Title'

import { default as QuizList } from '../../../../components/quizzes/panel/List'

class QuizDetail extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		author_slug: PropTypes.string.isRequired,
	}

	render() {
		const { data } = this.props

		return (
			<>
				<Title title={`${data.title} - Summery`} />

				<div className="card">
					<div className="card__body">
						<QuizList loading={false} quizzes={[data]} />
					</div>
					<hr />

					<div className="card__body" style={{ textAlign: 'center' }}>
						<h4>URL address to your quiz:</h4>
						<br />
						<a
							rel="noreferrer"
							target="_blank"
							href={`/quizzes/${this.props.author_slug}/${data.slug}`}
							style={{
								fontSize: '1.1rem',
								wordWrap: 'break-word',
							}}
						>
							{`${window.location.origin}/quizzes/${this.props.author_slug}/${data.slug}`}
						</a>
					</div>
				</div>
			</>
		)
	}
}

const mapStateToProps = (state) => ({
	author_slug: state.auth.user.slug,
})

export default connect(mapStateToProps, null)(QuizDetail)
