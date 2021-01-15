import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { AiFillEdit } from 'react-icons/ai'
import { RiImageEditFill } from 'react-icons/ri'

import { getCategorySection, createQuiz } from '../../redux/actions/quizzes'
import { clearErrors } from '../../redux/actions/errors'
import ImageUrlPreview from './ImageUrlPreview'
import Textarea from '../../common/Textarea'

class CreateForm extends Component {
    static propTypes = {
        getCategorySection: PropTypes.func.isRequired,
        sections: PropTypes.array.isRequired,
        categories: PropTypes.array.isRequired,
        errors: PropTypes.object,
        clearErrors: PropTypes.func.isRequired,
        createQuiz: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            title: '',
            description: 'Welcome to my quiz!',
            section: '',
            category: '',
            image_url: '',
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount = () => {
        if (this.props.sections.length > 0 && this.props.categories.length > 0) {
            this.setState({
                section: this.props.sections[0].name,
                category: this.props.categories[0].name,
            })
        }
    }

    componentDidUpdate(prevProps, _) {
        if(prevProps.categories !== this.props.categories && prevProps.sections !== this.props.sections)
            this.setState({
                section: this.props.sections[0].name,
                category: this.props.categories[0].name,
            })
    }

    componentWillUnmount = () => this.props.clearErrors()

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    onSubmit = e => {
        e.preventDefault()

        const { title, description, section, category, image_url } = this.state
        const quiz = { title, description, section, category, image_url }

        this.props.createQuiz(quiz)
        this.props.history.push('/')
    }

    render() {
        const { title, description, section, category, image_url } = this.state

        const sections = this.props.sections.map((section, index) => (
            <option value={section.name} key={index}>
                {section.display_name}
            </option>
        ))

        const categories = this.props.categories.map((category, index) => (
            <option value={category.name} key={index}>
                {category.display_name}
            </option>
        ))

        return (
            <form onSubmit={this.onSubmit}>
                <div className="row">
                    {
                        this.props.errors.detail ? (
                            <div className="error-box">
                                <p className="error-text">{this.props.errors.detail}</p>
                            </div>
                        ) : ''
                    }

                    <div className="col col-md-6">
                        {
                            this.props.errors.title ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.title.map((error, index) => (
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
                            this.props.errors.section ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.section.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                        <div className="form-control">
                            <label className="form-control__label">Section:</label>
                            <select
                                className="select-btn form-control__input"
                                name="section"
                                onChange={this.onChange}
                                value={section}
                            >
                                {sections}
                            </select>
                        </div>

                        {
                            this.props.errors.category ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.category.map((error, index) => (
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
                                {categories}
                            </select>
                        </div>

                        {
                            this.props.errors.description ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.description.map((error, index) => (
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
                            this.props.errors.image_url ? (
                                <div className="error-box">
                                    {
                                        this.props.errors.image_url.map((error, index) => (
                                            <p className="error-text" key={index}>{error}</p>
                                        ))
                                    }
                                </div>
                            ) : ''
                        }
                    </div>
                </div>

                <button className="btn btn__submit btn__contrast">Create a Quiz</button>
            </form>
        )
    }
}

const mapStateToProps = state => ({
    sections: state.quizzes.sections.data,
    categories: state.quizzes.categories.data,
    errors: state.errors.messages,
})

const mapDispatchToProps = {
    getCategorySection,
    clearErrors,
    createQuiz,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateForm))
