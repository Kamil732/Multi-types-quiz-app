import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../redux/actions/quizzes'

import TitleSearchForm from '../../components/quizzes/search/TitleSearchForm'
import { default as QuizList } from '../../components/quizzes/List'
import Pagination from '../../components/Pagination'
import Title from '../../common/Title'

export class Quizzes extends Component {
    static propTypes = {
        accessToken: PropTypes.string.isRequired,
        getQuizzes: PropTypes.func.isRequired,
        loading: PropTypes.bool,
        quizzes: PropTypes.object,
    }

    constructor(props) {
        super(props)

        this.searchQuiz = this.searchQuiz.bind(this)
    }

    searchQuiz = () => this.props.getQuizzes(this.props.location.search, 'http://192.168.1.31:8000/api/accounts/current/quizzes/')

    componentDidMount = () => this.searchQuiz()

    componentDidUpdate = (prevProps, _) => prevProps.location !== this.props.location ? this.searchQuiz() : null

    render() {
        return (
            <>
                <Title title="My Quizzes" />

                <div className="row">
                    <div className="col col-lg-3">
                        <TitleSearchForm />
                    </div>
                    <div className="col col-lg-9">
                        <div className="card">
                            <header className="card__header">My Quizzes</header>
                            <section className="card__body">
                                <QuizList quizzes={this.props.quizzes.results} loading={this.props.loading} />
                            </section>
                            <footer className="card__footer">
                                <Pagination pageCount={this.props.quizzes.pageCount} />
                            </footer>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.auth.token,
    loading: state.quizzes.quizzes.loading,
    quizzes: state.quizzes.quizzes.data,
})

const mapDispatchToProps = {
    getQuizzes,
}

export default connect(mapStateToProps, mapDispatchToProps)(Quizzes)
