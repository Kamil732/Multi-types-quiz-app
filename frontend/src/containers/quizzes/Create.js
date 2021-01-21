import React from 'react'
import Title from '../../common/Title'

import CreateForm from '../../components/quizzes/CreateForm'
import Navigation from './Navigation'

function Create() {
    return (
        <>
            <Title title="Create Quiz" />

            <div className="row">
                <div className="col col-sm-3">
                    <Navigation />
                </div>
                <div className="col col-sm-9">
                    <div className="card">
                        <div className="card__header">
                            Creating a New Quiz
                        </div>
                        <div className="card__body">
                            <CreateForm />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create