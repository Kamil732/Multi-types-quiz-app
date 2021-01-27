import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearErrors } from '../../../../redux/actions/errors'
import { getCategorySection, updateQuizData } from '../../../../redux/actions/quizzes'

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
        errors: PropTypes.array,
        updateQuizData: PropTypes.func.isRequired,
        getCategorySection: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        const { data } = this.props

        this.state = {
            title: data.title,
            category: data.category.name,
            description: data.description,
            image_url: data.image_url,
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillUnmount = () => this.props.clearErrors()

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    onSubmit = e => {
        e.preventDefault()

        const { title, category, description, image_url } = this.state
        const quiz = { title, description, category, image_url }

        this.props.clearErrors()
        this.props.updateQuizData(this.props.author_slug, this.props.match.params.quiz_slug, quiz)
    }

    render() {
        const { errors, categories } = this.props
        const { title, category, description, image_url } = this.state

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
                            <div className="error-box">
                                <p className="error-text">{errors.detail}</p>
                            </div>
                        ) : ''
                    }

                    <div className="col col-md-6">
                        {
                            errors.title ? (
                                <div className="error-box">
                                    {
                                        errors.title.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
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
                                <div className="error-box">
                                    {
                                        errors.category.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
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
                                <div className="error-box">
                                    {
                                        errors.description.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
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
                                rows="10"
                                required
                            />
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
                                <div className="error-box">
                                    {
                                        errors.image_url.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                    </div>
                </div>

                <button className="btn btn__submit btn__contrast">Save</button>
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
    getCategorySection,
    updateQuizData,
    clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsForm))
