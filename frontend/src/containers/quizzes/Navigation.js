import React from 'react'

import ActiveTag from '../../components/navigation/ActiveTag'
import Ad from '../../components/Ad'

function Navigation() {
    return (
        <>
            <nav className="vertical-menu card">
                <ActiveTag to={['/panel/dashboard']} className="vertical-menu__item">Dashboard</ActiveTag>
                <ActiveTag to={['/panel/settings']} className="vertical-menu__item">Account Settings</ActiveTag>
                <ActiveTag to={['/quizzes/create']} className="vertical-menu__item">Create Quiz</ActiveTag>
            </nav>
            <Ad />
        </>
    )
}

export default Navigation