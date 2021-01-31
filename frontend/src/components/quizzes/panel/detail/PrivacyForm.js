import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { clearErrors } from '../../../../redux/actions/errors'
import { updateQuizData } from '../../../../redux/actions/quizzes'
import { withRouter } from 'react-router-dom'

class PrivacyForm extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        errors: PropTypes.object,
        author_slug: PropTypes.string.isRequired,
        updateQuizData: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        const { data } = this.props

        this.initialData = {
            ask_name: data.ask_name,
            ask_email: data.ask_email,
            ask_gender: data.ask_gender,
            ask_opinion: data.ask_opinion,
            password: data.password,
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

    componentDidUpdate(_, prevState) {
        if (prevState.data !== this.state.data)
            this.setState({ hasChanged: JSON.stringify(this.initialData) !== JSON.stringify(this.state.data) })
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

    onSubmit = async e => {
        e.preventDefault()

        const { ask_name, ask_email, ask_gender, ask_opinion, password } = this.state.data
        const quiz = { ask_name, ask_email, ask_gender, ask_opinion, password }

        this.props.clearErrors()
        await this.props.updateQuizData(this.props.author_slug, this.props.match.params.quiz_slug, quiz)
    }

    cancel = () =>
        this.setState({
            hasChanged: false,
            data: this.initialData,
        })


    render() {
        const { errors } = this.props
        const { is_published } = this.props.data
        const { ask_name, ask_email, ask_gender, ask_opinion, password } = this.state.data

        return (
            <form onSubmit={this.onSubmit}>
                {
                    errors.detail ? (
                        <div className="message-box error">
                            <p className="message-box__text">{errors.detail}</p>
                        </div>
                    ) : ''
                }


                {
                    errors.ask_name ? (
                        <div className="message-box error">
                            {
                                errors.ask_name.map((error, index) => (
                                    <p className="message-box__text" key={index}>{error}</p>
                                ))
                            }
                        </div>
                    ) : ''
                }
                <div className="form-inline">
                    <label className="form-inline__label" htmlFor="ask_name">Ask about name:</label>
                    <div className={`switch-btn ${!is_published ? 'btn__disabled' : ''}`} id="ask_name">
                        <input
                            type="radio"
                            id="ask_name__true"
                            name="ask_name"
                            value="true"
                            onChange={this.onChangeRadio}
                            checked={ask_name === true}
                        />
                        <label htmlFor="ask_name__true">Yes</label>

                        <input
                            type="radio"
                            id="ask_name__false"
                            name="ask_name"
                            value="false"
                            onChange={this.onChangeRadio}
                            checked={ask_name === false}
                        />
                        <label htmlFor="ask_name__false">No</label>
                    </div>
                </div>

                {
                    errors.ask_email ? (
                        <div className="message-box error">
                            {
                                errors.ask_email.map((error, index) => (
                                    <p className="message-box__text" key={index}>{error}</p>
                                ))
                            }
                        </div>
                    ) : ''
                }
                <div className="form-inline">
                    <label className="form-inline__label" htmlFor="ask_email">Ask about email:</label>
                    <div className={`switch-btn ${!is_published ? 'btn__disabled' : ''}`} id="ask_email">
                        <input
                            type="radio"
                            id="ask_email__true"
                            name="ask_email"
                            value="true"
                            onChange={this.onChangeRadio}
                            checked={ask_email === true}
                        />
                        <label htmlFor="ask_email__true">Yes</label>

                        <input
                            type="radio"
                            id="ask_email__false"
                            name="ask_email"
                            value="false"
                            onChange={this.onChangeRadio}
                            checked={ask_email === false}
                        />
                        <label htmlFor="ask_email__false">No</label>
                    </div>
                </div>

                {
                    errors.ask_gender ? (
                        <div className="message-box error">
                            {
                                errors.ask_gender.map((error, index) => (
                                    <p className="message-box__text" key={index}>{error}</p>
                                ))
                            }
                        </div>
                    ) : ''
                }
                <div className="form-inline">
                    <label className="form-inline__label" htmlFor="ask_gender">Ask about gender:</label>
                    <div className={`switch-btn ${!is_published ? 'btn__disabled' : ''}`} id="ask_gender">
                        <input
                            type="radio"
                            id="ask_gender__true"
                            name="ask_gender"
                            value="true"
                            onChange={this.onChangeRadio}
                            checked={ask_gender === true}
                        />
                        <label htmlFor="ask_gender__true">Yes</label>

                        <input
                            type="radio"
                            id="ask_gender__false"
                            name="ask_gender"
                            value="false"
                            onChange={this.onChangeRadio}
                            checked={ask_gender === false}
                        />
                        <label htmlFor="ask_gender__false">No</label>
                    </div>
                </div>

                {
                    errors.ask_opinion ? (
                        <div className="message-box error">
                            {
                                errors.ask_opinion.map((error, index) => (
                                    <p className="message-box__text" key={index}>{error}</p>
                                ))
                            }
                        </div>
                    ) : ''
                }
                <div className="form-inline">
                    <label className="form-inline__label" htmlFor="ask_opinion">Ask about opinion:</label>
                    <div className={`switch-btn ${!is_published ? 'btn__disabled' : ''}`} id="ask_opinion">
                        <input
                            type="radio"
                            id="ask_opinion__true"
                            name="ask_opinion"
                            value="true"
                            onChange={this.onChangeRadio}
                            checked={ask_opinion === true}
                        />
                        <label htmlFor="ask_opinion__true">Yes</label>

                        <input
                            type="radio"
                            id="ask_opinion__false"
                            name="ask_opinion"
                            value="false"
                            onChange={this.onChangeRadio}
                            checked={ask_opinion === false}
                        />
                        <label htmlFor="ask_opinion__false">No</label>
                    </div>
                </div>

                {
                    errors.password ? (
                        <div className="message-box error">
                            {
                                errors.password.map((error, index) => (
                                    <p className="message-box__text" key={index}>{error}</p>
                                ))
                            }
                        </div>
                    ) : ''
                }
                <div className="form-inline">
                    <label className="form-inline__label" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        className={`form-inline__input ${!is_published ? 'btn__disabled' : ''}`}
                        readOnly={!is_published}
                    />
                    <small className="help-text">
                        <span className="help-text__optional">OPTIONAL</span>
                        To start solving your quiz, users will have to pass the password. Leave this field empty if you don't want require password.
                    </small>
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
    errors: state.errors.messages,
})

const mapDispatchToProps = {
    updateQuizData,
    clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PrivacyForm))
