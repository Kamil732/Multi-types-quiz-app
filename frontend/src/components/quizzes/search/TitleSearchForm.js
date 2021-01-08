import React, { Component } from 'react'

import queryString from 'query-string'

import { withRouter } from 'react-router-dom'
import search from '../../../helpers/search'

class TitleSearchForm extends Component {
    constructor(props) {
        super(props)

        const query = queryString.parse(this.props.location.search);
        this.state = {
            title: query.title__istartswith || '',
        }

        this.onChange = this.onChange.bind(this)
        this.searchQuiz = this.searchQuiz.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    searchQuiz = (key, value) => search(this.props, key, value.trim())

    onSubmit = e => {
        e.preventDefault()

        const { title } = this.state
        window.scrollTo({ top: 0, behavior: 'smooth' })

        this.searchQuiz('title__istartswith', title)
    }

    // componentDidUpdate(_, prevState) {
    //     if (prevState !== this.state) {
    //         const { title } = this.state

    //         this.searchQuiz('title__istartswith', title)
    //     }
    // }

    render() {
        const { title } = this.state

        return (
            <>
                <div className="card">
                    <div className="card__header">Search Quiz</div>
                    <div className="card__body">
                        <form onSubmit={this.onSubmit} method="get">
                            <div className="form-control">
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control__input"
                                    placeholder="Search by title..."
                                    value={title}
                                    onChange={this.onChange}
                                />
                            </div>

                            <button type="submit" className="btn btn__submit">Search</button>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}



export default withRouter(TitleSearchForm)
