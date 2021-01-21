import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Navigation from '../Navigation'

class Dashboard extends Component {
    render() {
        return (
            <>
                <div className="row">
                    <div className="col col-sm-3">
                        <Navigation />
                    </div>
                    <div className="col col-sm-9">
                        <div className="card">
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                            <div className="card__body"></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
