import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import CircleLoader from '../../components/loaders/CircleLoader'
import TextTruncate from 'react-text-truncate'

class List extends Component {
	static propTypes = {
		quizzes: PropTypes.array,
		loading: PropTypes.bool,
	}

	render() {
		if (this.props.loading) return <CircleLoader />
		else if (this.props.quizzes.length > 0)
			return this.props.quizzes.map((quiz, index) => (
				<article className="card-inline quiz-card" key={index}>
					<Link
						to={`/quizzes/${quiz.author_slug}/${quiz.slug}`}
						className="card-inline__img-link"
					>
						<img
							className="card-inline__img quiz-card__img"
							src={quiz.image_url}
							alt={quiz.title}
						/>
					</Link>

					<section className="card-inline__body quiz-card__body">
						<header className="quiz-card__header text-darken display-sm">
							<span>
								Section:&ensp;
								<Link to={`?section=${quiz.section.name}`}>
									{quiz.section.display_name}
								</Link>
							</span>
							&ensp;&bull;&ensp;
							<span>
								Category:&ensp;
								<Link
									to={`?category__name=${quiz.category.name}`}
								>
									{quiz.category.display_name}
								</Link>
							</span>
						</header>
						<aside>
							<Link
								to={`/quizzes/${quiz.author_slug}/${quiz.slug}`}
								className="quiz-card__link"
							>
								<TextTruncate
									text={quiz.title}
									line={2}
									truncateText="…"
								/>
							</Link>
							<TextTruncate
								text={quiz.description}
								element="p"
								line={1}
								truncateText="…"
								containerClassName="quiz-card__description"
							/>
						</aside>
						<footer>
							<p className="text-darken display-sm">
								<Link to={`/profile/${quiz.author_slug}`}>
									{quiz.author}
								</Link>
								&ensp;&bull;&ensp;
								<span>
									Solved {quiz.solved_times} time
									{quiz.solved_times !== 1 ? 's' : ''}
								</span>
							</p>
						</footer>
					</section>
				</article>
			))

		return (
			<div className="no-quizzes">
				<h1 className="no-quizzes__text">No Quizzes are Available</h1>
			</div>
		)
	}
}

export default List
