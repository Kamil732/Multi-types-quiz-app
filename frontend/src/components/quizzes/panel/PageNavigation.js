import React from 'react'

import ActiveTag from '../../navigation/ActiveTag'
import Ad from '../../Ad'
import Routes from './Routes'

import { RiDashboardFill } from 'react-icons/ri'
import { GrUserSettings } from 'react-icons/gr'
import { FaPlusCircle } from 'react-icons/fa'

function PageNavigation() {
    return (
        <div className="row">
            <div className="col col-sm-3">
                <nav className="vertical-menu card">
                    <ActiveTag to={['/panel/dashboard']} className="vertical-menu__item">
                        <span className="icon-text">
                            <RiDashboardFill className="icon-text__icon" />
                            Dashboard
                        </span>
                    </ActiveTag>
                    <ActiveTag to={['/panel/settings']} className="vertical-menu__item">
                        <span className="icon-text">
                            <GrUserSettings className="icon-text__icon" />
                            Account Settings
                        </span>
                    </ActiveTag>
                    <ActiveTag to={['/panel/create-quiz']} className="vertical-menu__item">
                        <span className="icon-text">
                            <FaPlusCircle className="icon-text__icon" />
                            Create Quiz
                        </span>
                    </ActiveTag>
                </nav>
                <Ad />
            </div>
            <div className="col col-sm-9">
                <Routes />
            </div>
        </div>
    )
}

export default PageNavigation