import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import NotFound from '../containers/errors/NotFound'

import Home from '../containers/quizzes/Home'
import { default as QuizDetailRoutes } from '../components/quizzes/detail/Routes'

import Auth from '../containers/accounts/Auth'
import ResetPassword from '../containers/accounts/ResetPassword'
import Profile from '../containers/accounts/Profile'
import PrivateRoute from '../common/PrivateRoute'
import Panel from '../components/quizzes/panel/Panel'

function Routes() {
	return (
		<section className="content-wrap container-mobile">
			<Switch>
				<Route exact path="/" component={Home} />
				<Route
					path="/quizzes/:author_slug/:quiz_slug"
					component={QuizDetailRoutes}
				/>

				<Route
					exact
					path="/login"
					component={() => <Auth type="login" />}
				/>
				<Route path="/reset-password" exact component={ResetPassword} />
				<Route
					exact
					path="/register"
					component={() => <Auth type="register" />}
				/>
				<Route
					exact
					path="/profile/:profile_slug"
					component={Profile}
				/>

				<PrivateRoute path="/panel/" component={Panel} />

				<Route path="/not-found" component={NotFound} />

				<Redirect to="/not-found" />
			</Switch>
		</section>
	)
}

export default Routes
