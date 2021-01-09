import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import CircleLoader from '../../components/loaders/CircleLoader'
import Title from '../../common/Title'

export class Detail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            quiz: {},
        }

        this.getQuizData = this.getQuizData.bind(this)
    }

    async getQuizData() {
        const { author_slug, quiz_slug } = this.props.match.params
        try {
            const quiz = await axios.get(`http://192.168.1.31:8000/api/quizzes/${author_slug}/${quiz_slug}/`)

            this.setState({
                loading: false,
                quiz: quiz.data,
            })
        } catch (err) {
            throw Error(err)
        }
    }

    componentDidMount = () => this.getQuizData()

    componentDidUpdate(prevProps, _) {
        if (prevProps.match.params.author_slug !== this.props.match.params.author_slug ||
            prevProps.match.params.quiz_slug !== this.props.match.params.quiz_slug)
            this.getQuizData()
    }

    render() {
        const { loading, quiz } = this.state

        if (loading) return <CircleLoader />

        return (
            <>
                <Title title={`Quiz Detail ${quiz.title}`} />
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
