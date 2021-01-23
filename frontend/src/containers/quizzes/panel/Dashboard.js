import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../../redux/actions/quizzes'

import Title from '../../../common/Title'
import CircleLoader from '../../../components/loaders/CircleLoader'
import Pagination from '../../../components/Pagination'
import { Link, withRouter } from 'react-router-dom'
import FacebookShare from '../../../components/social_media/FacebookShare'
import TwitterShare from '../../../components/social_media/TwitterShare'

import TextTruncate from 'react-text-truncate'

class Dashboard extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        getQuizzes: PropTypes.func.isRequired,
        quizzes: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)

        this.searchQuiz = this.searchQuiz.bind(this)
    }

    searchQuiz = () => this.props.getQuizzes(this.props.location.search, `${process.env.REACT_APP_API_URL}/accounts/current/quizzes/`, true)

    componentDidMount = () => this.searchQuiz()

    componentDidUpdate = (prevProps, _) => {
        if (prevProps.location.search !== this.props.location.search)
            this.searchQuiz()
    }

    render() {
        const { loading, quizzes } = this.props

        const quizList = quizzes.results.map((quiz, index) => (
            <tr key={index}>
                <td className="quiz-display">
                    <Link to={`/panel/dashboard/${quiz.slug}`}>
                        <img className="quiz-display__img" src={quiz.image_url} alt="" />
                    </Link>

                    <div className="share-items">
                        <FacebookShare url={window.location.href} quote={quiz.title} image_url={quiz.image_url} />
                        <TwitterShare url={window.location.href} title={quiz.title} />
                    </div>
                </td>
                <td className="title">
                    <Link className="quiz-card__link" to={`/panel/dashboard/${quiz.slug}`}>
                        <TextTruncate
                            text={quiz.title}
                            line={3}
                            truncateText="..."
                        />
                    </Link>
                    <TextTruncate
                        text={quiz.description}
                        line={1}
                        truncateText="..."
                    />
                    <span>
                        Type: {quiz.section.display_name}
                    </span>
                    <span>
                        {quiz.pub_date} &bull;
                        <Link to={`/?category__name=${quiz.category.name}`}>{quiz.category.display_name}</Link> &bull;
                        <Link to={`/profile/${quiz.author_slug}`}>{quiz.author}</Link>
                    </span>
                </td>
                <td className="numbers">
                    {quiz.question_amount}
                </td>
                <td className="numbers">
                    {quiz.solved_times}
                </td>
                <td className="actions">
                    <Link to={`/panel/dashboard/${quiz.slug}/edit`}>
                        <button className="btn">Edit</button>
                    </Link>
                    <br />

                    <Link to={`/quizzes/${quiz.author_slug}/${quiz.slug}`}>
                        <button className="btn btn__contrast">Start Quiz</button>
                    </Link>
                    <br /> <br /> <br />

                    <button className="btn btn__danger">Delete</button>
                </td>
            </tr>
        ))

        return (
            <>
                <Title title="Dashboard" />

                <div className="card__footer">
                    <Pagination pageCount={quizzes.pageCount} />
                </div>

                <div className="card">
                    <div className="card__header">
                        My Quizzes
                    </div>
                    <div className="card__body">
                        {
                            loading ? <CircleLoader /> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Image</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Questions</th>
                                                <th scope="col">Solves</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {quizList}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    loading: state.quizzes.quizzes.loading,
    quizzes: state.quizzes.quizzes.data,
})

const mapDispatchToProps = {
    getQuizzes,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard))
