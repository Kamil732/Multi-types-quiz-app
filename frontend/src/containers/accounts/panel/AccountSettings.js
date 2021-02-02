import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class AccountSettings extends Component {
    render() {
        return (
            <div>
                <h1>Account Settings</h1>
            </div>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
