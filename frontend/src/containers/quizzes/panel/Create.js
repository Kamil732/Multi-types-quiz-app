import React from 'react'
import Title from '../../../common/Title'

import CreateForm from '../../../components/quizzes/CreateForm'

function Create() {
    return (
        <>
            <Title title="Create Quiz" />

            <div className="card">
                <div className="card__header">
                    Creating a New Quiz
                </div>
                <div className="card__body">
                    <CreateForm />
                </div>
            </div>
        </>
    )
}

export default Create