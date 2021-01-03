import React, { Component } from 'react'

import CreateForm from '../../components/quizzes/CreateForm'

class Create extends Component {
    render() {
        return (
            <div className="card">
                <div className="card__header">
                    Creating a New Quiz
                </div>
                <div className="card__body">
                    <CreateForm />
                </div>
            </div>
        )
    }
}

export default Create