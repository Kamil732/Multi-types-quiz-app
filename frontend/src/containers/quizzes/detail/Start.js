import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Title from '../../../common/Title'

class Start extends Component {
    static propTypes = {
        author_slug: PropTypes.string.isRequired,
        isOwner: PropTypes.bool,
        data: PropTypes.object.isRequired,
    }

    render() {
        const { data } = this.props

        return (
            <>
                <Title title={`Start Quiz - ${data.title}`} />

            </>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Start)
