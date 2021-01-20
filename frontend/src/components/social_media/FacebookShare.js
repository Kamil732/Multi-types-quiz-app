import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {FacebookShareButton, FacebookIcon} from "react-share";

class FacebookShare extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        quote: PropTypes.string.isRequired,
    }

    render() {
        return (
            <>
                <FacebookShareButton
                    url={this.props.url}
                    quote={this.props.quote}
                    hashtag="#quizzer"
                >
                    <FacebookIcon size={50} round={true} />
                </FacebookShareButton>
            </>
        )
    }
}

export default FacebookShare
