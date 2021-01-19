import React, { Component } from 'react'
import axios from 'axios'
import CircleLoader from '../../components/loaders/CircleLoader'
import Title from '../../common/Title'
import NotFound from '../errors/NotFound'

import FacebookShare from '../../components/social_media/FacebookShare'

export class Detail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            data: {},
        }

        this.getQuizData = this.getQuizData.bind(this)
    }

    async getQuizData() {
        const { author_slug, quiz_slug } = this.props.match.params

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${author_slug}/${quiz_slug}/`)

            this.setState({
                loading: false,
                data: res.data,
            })
        } catch (err) {
            this.setState({
                loading: false,
                data: [],
            })
        }
    }

    componentDidMount = () => this.getQuizData()

    componentDidUpdate(prevProps, _) {
        if (prevProps.match.params.author_slug !== this.props.match.params.author_slug ||
            prevProps.match.params.quiz_slug !== this.props.match.params.quiz_slug)
            this.getQuizData()
    }

    render() {
        const { loading, data } = this.state

        if (loading)
            return <CircleLoader />
        else if (Object.keys(data).length === 0)
            return <NotFound />

        return (
            <>
                <Title title={`Quiz Detail ${data.title}`} />

                <div className="row">
                    <div className="col-md-9">
                        <div className="card__header">
                            {data.title}
                        </div>
                        <div className="card">
                            <div className="card__body">
                                <div className="quiz-detail">
                                    <img className="quiz-detail__img" src={data.image_url} alt={data.title} />
                                    {data.description}
                                </div>
                            </div>

                            <hr />

                        <div className="card__body">
                            <FacebookShare />
                        </div>
                        </div>
                        <div className="card__footer">
                            <button className="btn btn__submit btn__contrast">START</button>
                        </div>
                    </div>
                    <div className="col-md-3">

                    </div>
                </div>
            </>
        )
    }
}

export default Detail
