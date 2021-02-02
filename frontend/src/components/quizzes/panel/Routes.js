import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import PrivateRoute from '../../../common/PrivateRoute'
import AccountSettings from '../../../containers/accounts/panel/AccountSettings'
import Create from '../../../containers/quizzes/panel/Create'
import Dashboard from '../../../containers/quizzes/panel/Dashboard'
import Detail from './detail/Detail'

function Routes() {
    return (
        <Switch>
            <PrivateRoute exact path="/panel/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/panel/account-settings" component={AccountSettings} />
            <PrivateRoute exact path="/panel/create-quiz" component={Create} />
            <PrivateRoute path="/panel/dashboard/:quiz_slug" component={Detail} />

            <Redirect to="/not-found" />
        </Switch>
    )
}

export default Routes