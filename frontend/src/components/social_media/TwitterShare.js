import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { TwitterShareButton, TwitterIcon} from "react-share";

class TwitterShare extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }

    render() {
        return (
            <>
                <TwitterShareButton
                    url={this.props.url}
                    title={this.props.title}
                    hashtag="#quizzer"
                >
                    <TwitterIcon size={50} />
                </TwitterShareButton>
            </>
        )
    }
}

export default TwitterShare
