import React, { Component } from 'react'
import PropTypes from 'prop-types'

import QuizTextImg from '../../assets/images/quiz_text.png'

import TitleSearchForm from '../../components/quizzes/search/TitleSearchForm'
import { default as QuizList } from '../../components/quizzes/List'
import Pagination from '../../components/Pagination'
import { Link, withRouter } from 'react-router-dom'
import Ad from '../../components/Ad'
import CategorySearch from '../../components/quizzes/search/CategorySearch'
import SectionSearch from '../../components/quizzes/search/SectionSearch'

class Quizzes extends Component {
	static propTypes = {
		title: PropTypes.string,
		searchUrl: PropTypes.string,
		getQuizzes: PropTypes.func.isRequired,
		loading: PropTypes.bool,
		quizzes: PropTypes.object,
	}

	constructor(props) {
		super(props)

		this.searchQuiz = this.searchQuiz.bind(this)
	}

	searchQuiz = () =>
		this.props.getQuizzes(this.props.location.search, this.props.searchUrl)

	componentDidMount = () => this.searchQuiz()

	componentDidUpdate = (prevProps, _) => {
		if (
			prevProps.location.search !== this.props.location.search ||
			prevProps.searchUrl !== this.props.searchUrl
		)
			this.searchQuiz()
	}

	render() {
		const { title, quizzes, loading } = this.props

		return (
			<>
				<div className="row">
					<div className="col col-md-8">
						<div className="card">
							{title ? (
								<header className="card__header">
									{title}
								</header>
							) : null}
							<section className="card__body">
								<QuizList
									quizzes={quizzes.results}
									loading={loading}
								/>
							</section>
							<footer className="card__footer">
								<Pagination pageCount={quizzes.pageCount} />
							</footer>
						</div>
					</div>
					<div className="col col-md-4 card-col">
						<TitleSearchForm />

						<div className="card">
							<div className="card__header">
								Join our community
							</div>
							<div
								className="card__body"
								style={{ textAlign: 'center' }}
							>
								<img
									src={QuizTextImg}
									alt="Quiz"
									className="img-rounded"
								/>

								<p style={{ fontSize: '1.1rem' }}>
									If you enjoy solving quizzes, why not create
									your own?
									<br />
									Join our community and create your own quiz
									so you can test someone else's knowledge!
								</p>
							</div>
							<div className="card__footer">
								<Link to="/panel/create-quiz">
									<button
										className="btn btn__contrast"
										style={{ margin: '0 auto' }}
									>
										Create Quiz
									</button>
								</Link>
							</div>
						</div>

						<SectionSearch />
						<Ad />
						<CategorySearch />
					</div>
				</div>
			</>
		)
	}
}

export default withRouter(Quizzes)
