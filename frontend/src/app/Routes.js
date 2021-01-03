import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../containers/quizzes/Home'
import { default as CreateQuiz } from '../containers/quizzes/Create'
import { default as QuizDetail } from '../containers/quizzes/Detail'

import Auth from '../containers/accounts/Auth';
import { default as MyProfile } from '../containers/accounts/Profile';
import { default as MyQuizzes } from '../containers/accounts/Quizzes';
import PrivateRoute from '../common/PrivateRoute'

function Routes() {
    return (
        <section>
			<Switch>
                <Route exact path="/" component={Home} />
                <PrivateRoute exact path="/quizzes/create" component={CreateQuiz} />
                <Route exact path="/quizzes/:author_username/:slug" component={QuizDetail} />

                <Route exact path="/login" component={() => <Auth type="login" />} />
                <Route exact path="/register" component={() => <Auth type="register" />} />
                <PrivateRoute exact path="/my-profile" component={MyProfile} />
                <PrivateRoute exact path="/my-quizzes" component={MyQuizzes} />
            </Switch>
		</section>
    )
}

export default Routes