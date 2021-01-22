import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../../redux/actions/quizzes'

import Title from '../../../common/Title'
import CircleLoader from '../../../components/loaders/CircleLoader'
import Pagination from '../../../components/Pagination'
import { withRouter } from 'react-router-dom'

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
                <td>
                    <img className="quiz-card__img" src={quiz.image_url} alt="" />
                </td>
                <td>
                    {quiz.title}
                    created {quiz.pub_date}
                </td>
                <td>
                    {quiz.question_amount}
                </td>
                <td>
                    {quiz.solved_times}
                </td>
                <td>
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
                                <div style={{ overflowX: 'auto', border: '1px solid grey' }}>
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
