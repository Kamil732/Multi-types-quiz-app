import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'

import FacebookShare from '../../social_media/FacebookShare'
import TwitterShare from '../../social_media/TwitterShare'

import TextTruncate from 'react-text-truncate'
import CircleLoader from '../../loaders/CircleLoader'

import { deleteQuiz } from '../../../redux/actions/quizzes'

class List extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        quizzes: PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props)

        this.deleteQuiz = this.deleteQuiz.bind(this)
    }

    deleteQuiz = (author_slug, quiz_slug) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this quiz?",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn__danger',
                cancelButton: 'btn'
            },
            buttonsStyling: false,
            confirmButtonText: 'delete',
        }).then(res => {
            if (res.isConfirmed) {
                this.props.deleteQuiz(author_slug, quiz_slug)

                Swal.fire(
                    'Deleted!',
                    'Your quiz has been deleted',
                    'success'
                ).then(res => {
                    this.props.history.push('/');
                    this.props.history.replace('/panel/dashboard');
                })
            }
        })
    }

    render() {
        const { loading, quizzes } = this.props

        if (loading === true)
            return <CircleLoader />

        const quizList = quizzes.map((quiz, index) => (
            <tr key={index}>
                <td className="quiz-display">
                    <Link to={`/panel/dashboard/${quiz.slug}/summery`}>
                        <img className="quiz-display__img" src={quiz.image_url} alt="" />
                    </Link>

                    <div className="share-items">
                        <FacebookShare url={window.location.href} quote={quiz.title} image_url={quiz.image_url} />
                        <TwitterShare url={window.location.href} title={quiz.title} />
                    </div>
                </td>
                <td className="info">
                    <Link className="quiz-card__link" to={`/panel/dashboard/${quiz.slug}/summery`}>
                        <TextTruncate
                            text={quiz.title}
                            line={3}
                            truncateText="..."
                        />
                    </Link>
                    <span style={{ fontSize: '11px' }}>
                        {quiz.pub_date}
                        &ensp; &bull; &ensp;
                        <Link to={`/?category__name=${quiz.category.name}`}>{quiz.category.display_name}</Link>
                    </span> <br /> <br />
                    <TextTruncate
                        text={quiz.description}
                        line={1}
                        truncateText="..."
                        style={{ fontSize: '12px' }}
                    />  <br /> <br />
                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                        Type: {quiz.section.display_name}
                    </span>

                    <div className="actions">
                        <Link to={`/panel/dashboard/${quiz.slug}/settings`}>
                            <button className="btn">Edit</button>
                        </Link>
                        <br />

                        <Link to={`/quizzes/${quiz.author_slug}/${quiz.slug}`}>
                            <button className="btn btn__contrast">Start Quiz</button>
                        </Link>
                        <br /> <br /> <br />

                        <button className="btn btn__danger" onClick={() => this.deleteQuiz(quiz.author_slug, quiz.slug)}>Delete</button>
                    </div>

                    {
                        quiz.is_published === false ? (
                            <div className="message-box info">
                                <span className="message-box__text">
                                    This quiz is private. To change that click <Link to={`/panel/dashboard/${quiz.slug}/settings`}>Here</Link>
                                </span>
                            </div>
                        ) : null
                    }
                </td>
                <td className="numbers">
                    {quiz.question_amount}
                </td>
                <td className="numbers">
                    {quiz.solved_times}
                </td>
            </tr>
        ))

        if (quizList.length === 0)
            return (
                <div className="card__header">
                    There are not quizzes to display
                </div>
            )

        return (
            <div style={{ overflowX: 'auto' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col" style={{ padding: '0 150px' }}>Info</th>
                            <th scope="col">Questions</th>
                            <th scope="col">Solves</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizList}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapDispatchToProps = {
    deleteQuiz,
}

export default connect(null, mapDispatchToProps)(withRouter(List))
