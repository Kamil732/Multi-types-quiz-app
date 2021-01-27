import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SettingsForm from '../../../../components/quizzes/panel/detail/SettingsForm'

class Settings extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div className="card">
                <div className="card__body">
                    <SettingsForm data={this.props.data} />
                </div>
            </div>
        )
    }
}

export default Settings
