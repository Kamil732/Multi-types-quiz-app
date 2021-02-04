import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearErrors } from '../../../../redux/actions/errors'
import { updateQuizData } from '../../../../redux/actions/quizzes'

import { RiImageEditFill } from 'react-icons/ri'

import ImageUrlPreview from '../../ImageUrlPreview'
import { AiFillEdit } from 'react-icons/ai'
import Textarea from '../../../Textarea'
import { withRouter } from 'react-router-dom'

class SettingsForm extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        author_slug: PropTypes.string.isRequired,
        categories: PropTypes.array,
        errors: PropTypes.object,
        updateQuizData: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        const { data } = this.props

        this.initialData = {
            title: data.title,
            category: data.category.name,
            description: data.description,
            image_url: data.image_url,
            is_published: data.is_published,
            random_question_order: data.random_question_order,
            one_page_questions: data.one_page_questions,
        }

        this.state = {
            hasChanged: false,
            data: this.initialData,
        }

        this.onChange = this.onChange.bind(this)
        this.onChangeRadio = this.onChangeRadio.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.cancel = this.cancel.bind(this)
    }

    componentWillUnmount = () => this.props.clearErrors()

    onChange = e => this.setState(prevState => ({
        ...prevState,
        data: {
            ...prevState.data,
            [e.target.name]: e.target.value,
        }
    }))

    onChangeRadio = e => this.setState(prevState => ({
        ...prevState,
        data: {
            ...prevState.data,
            [e.target.name]: e.target.value === 'true' ? true : false
        }
    }))

    componentDidUpdate(_, prevState) {
        if (prevState.data !== this.state.data)
            this.setState({ hasChanged: JSON.stringify(this.initialData) !== JSON.stringify(this.state.data) })
    }

    onSubmit = async e => {
        e.preventDefault()

        const { title, category, description, image_url, is_published, random_question_order, one_page_questions } = this.state.data
        const quiz = { title, description, category, image_url, is_published, random_question_order, one_page_questions }

        this.props.clearErrors()
        await this.props.updateQuizData(this.props.author_slug, this.props.match.params.quiz_slug, quiz)
    }

    cancel = () =>
        this.setState({
            hasChanged: false,
            data: this.initialData,
        })

    render() {
        const { errors, categories } = this.props
        const { title, category, description, image_url, is_published, random_question_order, one_page_questions } = this.state.data

        const categoryOptions = categories.map((category, index) => (
            <option value={category.name} key={index}>
                {category.display_name}
            </option>
        ))

        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    {
                        errors.detail ? (
                            <div className="message-box error">
                                <p className="message-box__text">{errors.detail}</p>
                            </div>
                        ) : ''
                    }

                    <div className="col col-md-6">
                        {
                            errors.title ? (
                                <div className="message-box error">
                                    {
                                        errors.title.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <div className="icon-form">
                                <span className="icon">
                                    <AiFillEdit />
                                </span>

                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={this.onChange}
                                    className="form-control__input"
                                    placeholder="Pass the title..."
                                    required
                                />
                            </div>
                        </div>

                        {
                            errors.category ? (
                                <div className="message-box error">
                                    {
                                        errors.category.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <label className="form-control__label">Category:</label>
                            <select
                                className="select-btn form-control__input"
                                name="category"
                                onChange={this.onChange}
                                value={category}
                            >
                                {categoryOptions}
                            </select>
                        </div>

                        {
                            errors.description ? (
                                <div className="message-box error">
                                    {
                                        errors.description.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <label className="form-control__label">Description:</label>

                            <Textarea
                                name="description"
                                value={description}
                                onChange={this.onChange}
                                className="form-control__input form-control__textarea"
                                placeholder="Pass the description..."
                                rows="7"
                                required
                            />
                        </div>

                        {
                            errors.is_published ? (
                                <div className="message-box error">
                                    {
                                        errors.is_published.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-inline">
                            <label className="form-inline__label" htmlFor="is_published">Quiz availbility:</label>
                            <div className="switch-btn" id="is_published">
                                <input
                                    type="radio"
                                    id="is_published__true"
                                    name="is_published"
                                    value="true"
                                    onChange={this.onChangeRadio}
                                    checked={is_published === true}
                                />
                                <label htmlFor="is_published__true">Publish</label>

                                <input
                                    type="radio"
                                    id="is_published__false"
                                    name="is_published"
                                    value="false"
                                    onChange={this.onChangeRadio}
                                    checked={is_published === false}
                                />
                                <label htmlFor="is_published__false">Private</label>
                            </div>
                        </div>

                        {
                            errors.random_question_order ? (
                                <div className="message-box error">
                                    {
                                        errors.random_question_order.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-inline">
                            <label className="form-inline__label" htmlFor="random_question_order">Radom question order:</label>
                            <div className="switch-btn" id="random_question_order">
                                <input
                                    type="radio"
                                    id="random_question_order__true"
                                    name="random_question_order"
                                    value="true"
                                    onChange={this.onChangeRadio}
                                    checked={random_question_order === true}
                                />
                                <label htmlFor="random_question_order__true">Yes</label>

                                <input
                                    type="radio"
                                    id="random_question_order__false"
                                    name="random_question_order"
                                    value="false"
                                    onChange={this.onChangeRadio}
                                    checked={random_question_order === false}
                                />
                                <label htmlFor="random_question_order__false">No</label>
                            </div>
                        </div>

                        {
                            errors.one_page_questions ? (
                                <div className="message-box error">
                                    {
                                        errors.one_page_questions.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-inline">
                            <label className="form-inline__label" htmlFor="one_page_questions">Questions on one page:</label>
                            <div className="switch-btn" id="one_page_questions">
                                <input
                                    type="radio"
                                    id="one_page_questions__true"
                                    name="one_page_questions"
                                    value="true"
                                    onChange={this.onChangeRadio}
                                    checked={one_page_questions === true}
                                />
                                <label htmlFor="one_page_questions__true">Yes</label>

                                <input
                                    type="radio"
                                    id="one_page_questions__false"
                                    name="one_page_questions"
                                    value="false"
                                    onChange={this.onChangeRadio}
                                    checked={one_page_questions === false}
                                />
                                <label htmlFor="one_page_questions__false">No</label>
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <div className="form-control">
                            <div className="icon-form">
                                <span className="icon">
                                    <RiImageEditFill />
                                </span>

                                <input
                                    type="text"
                                    name="image_url"
                                    value={image_url}
                                    onChange={this.onChange}
                                    className="form-control__input"
                                    placeholder="Pass the url to an image..."
                                />
                            </div>
                        </div>
                        <ImageUrlPreview image_url={image_url} />

                        {
                            errors.image_url ? (
                                <div className="message-box error">
                                    {
                                        errors.image_url.map((error, index) => (
                                            <p className="message-box__text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                    </div>
                </div>

                <div className="inline-btns f-w">
                    <button type="reset" className={`btn ${!this.state.hasChanged ? 'btn__disabled' : ''}`} onClick={this.cancel}>Cancel</button>
                    <button type="submit" className={`btn btn__contrast ${!this.state.hasChanged ? 'btn__disabled' : ''}`}>Save</button>
                </div>
            </form>
        )
    }
}

const mapStateToProps = state => ({
    author_slug: state.auth.user.slug,
    categories: state.quizzes.categories.data,
    errors: state.errors.messages,
})

const mapDispatchToProps = {
    updateQuizData,
    clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsForm))
