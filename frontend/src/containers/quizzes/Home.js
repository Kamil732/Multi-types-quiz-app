import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getQuizzes } from '../../redux/actions/quizzes'

import Title from '../../common/Title'
import Quizzes from './Quizzes'


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
            <>
                <Title title="Quiz List" />

                <Quizzes
                    title="Most Popular Quizzes"
                    getQuizzes={this.props.getQuizzes}
                    loading={this.props.loading}
                    quizzes={this.props.quizzes}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
