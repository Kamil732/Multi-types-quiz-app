import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../../redux/actions/quizzes'

import Title from '../../../common/Title'
import Pagination from '../../../components/Pagination'
import { withRouter } from 'react-router-dom'

import { default as QuizList } from '../../../components/quizzes/panel/List'

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

        return (
            <>
                <Title title="Dashboard" />

                <div className="card">
                    <div className="card__header">
                        My Quizzes
                    </div>
                    <div className="card__body">
                        <QuizList
                            loading={loading}
                            quizzes={quizzes.results}
                        />
                    </div>
                    <div className="card__footer">
                        <Pagination pageCount={quizzes.pageCount} />
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
