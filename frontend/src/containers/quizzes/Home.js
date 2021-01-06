import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../redux/actions/quizzes'

import { default as QuizList } from '../../components/quizzes/List'
import TitleSearchForm from '../../components/quizzes/search/TitleSearchForm'
import CategorySearch from '../../components/quizzes/search/CategorySearch'
import SectionSearch from '../../components/quizzes/search/SectionSearch'
import Pagination from '../../components/Pagination'
import Ad from '../../components/Ad'



class Home extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        getQuizzes: PropTypes.func.isRequired,
        quizzes: PropTypes.object.isRequired,
    }

    componentDidMount = () => this.props.getQuizzes(this.props.location.search)

    componentDidUpdate(prevProps, _) {
        if (prevProps.location !== this.props.location)
            this.props.getQuizzes(this.props.location.search)
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <header className="card__header">Most Popular Quizzes</header>
                        <section className="card__body">
                            <QuizList quizzes={this.props.quizzes.results} loading={this.props.loading} />
                        </section>
                        <footer className="card__footer">
                            <Pagination pageCount={this.props.quizzes.pageCount} />
                        </footer>
                    </div>
                </div>
                <div className="col-md-4 section-category-list">
                    <TitleSearchForm />
                    <Ad />
                    <SectionSearch />
                    <Ad />
                    <CategorySearch />
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
