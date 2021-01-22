import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../../redux/actions/quizzes'

import Title from '../../../common/Title'
import CircleLoader from '../../../components/loaders/CircleLoader'

class Dashboard extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        getQuizzes: PropTypes.func.isRequired,
        quizzes: PropTypes.object.isRequired,
    }

    componentDidMount = () => this.props.getQuizzes('', `${process.env.REACT_APP_API_URL}/accounts/current/quizzes/`, true)

    render() {
        const { loading, quizzes } = this.props

        if (loading)
            return <CircleLoader />

        const quizList = quizzes.results.map(quiz => (
            <h1>{quiz.title}</h1>
        ))

        return (
            <>
                <Title title="Dashboard" />

                <div className="card">
                    <div className="card__header">
                        My Quizzes
                    </div>
                    <div className="card__body">
                        {quizList}
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
