import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CircleLoader from '../../components/loaders/CircleLoader'

export class Detail extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                author_username: PropTypes.string.isRequired,
                slug: PropTypes.string.isRequired,
            })
        }),
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    state = {
        loading: true,
        quiz: {},
    }

    async componentDidMount() {
        const params = {
            author_username: this.props.match.params.author_username,
            slug: this.props.match.params.slug,
        }

        try {
            const quiz = await axios.get(`http://192.168.1.31:8000/api/quizzes/${params.author_username}/${params.slug}/`)

            this.setState({
                loading: false,
                quiz: quiz.data,
            })
        } catch (err) {
            throw Error(err)
        }
    }

    render() {
        const { loading, quiz } = this.state

        if (loading) return <CircleLoader />

        return (
            <>
                <div>
                    {quiz.title}
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
