import React from 'react'
import { Switch, Route } from 'react-router-dom'

import NotFound from '../containers/errors/NotFound'

import Home from '../containers/quizzes/Home'
import { default as QuizDetail } from '../containers/quizzes/Detail'

import Auth from '../containers/accounts/Auth';
import Profile from '../containers/accounts/Profile';
import PrivateRoute from '../common/PrivateRoute'
import Navigation from '../containers/quizzes/panel/Navigation'

function Routes() {
    return (
        <section>
			<Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/quizzes/:author_slug/:quiz_slug" component={QuizDetail} />

                <Route exact path="/login" component={() => <Auth type="login" />} />
                <Route exact path="/register" component={() => <Auth type="register" />} />
                <Route exact path="/profile/:profile_slug" component={Profile} />

                <PrivateRoute path="/panel/" component={Navigation} />

                <Route path="*" component={NotFound} />
            </Switch>
		</section>
    )
}

export default Routes