import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TitleSearchForm from '../../components/quizzes/search/TitleSearchForm'
import { default as QuizList } from '../../components/quizzes/List'
import Pagination from '../../components/Pagination'
import { withRouter } from 'react-router-dom'
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

    searchQuiz = () => this.props.getQuizzes(this.props.location.search, this.props.searchUrl)

    componentDidMount = () => this.searchQuiz()

    componentDidUpdate = (prevProps, _) => {
        if (prevProps.location.search !== this.props.location.search ||
            prevProps.searchUrl !== this.props.searchUrl)
            this.searchQuiz()
    }


    render() {
        const { title, quizzes, loading } = this.props

        return (
            <>
                <div className="row">
                    <div className="col col-md-8">
                        <div className="card">
                            {
                                title ? (
                                    <header className="card__header">{ title }</header>
                                ) : null
                            }
                            <section className="card__body">
                                <QuizList quizzes={quizzes.results} loading={loading} />
                            </section>
                            <footer className="card__footer">
                                <Pagination pageCount={quizzes.pageCount} />
                            </footer>
                        </div>
                    </div>
                    <div className="col col-md-4 card-col">
                        <TitleSearchForm />
                        <Ad />
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
