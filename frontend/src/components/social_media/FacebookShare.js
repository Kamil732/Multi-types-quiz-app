import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FacebookShareButton, FacebookIcon } from "react-share";

import { Helmet } from 'react-helmet'

class FacebookShare extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        quote: PropTypes.string.isRequired,
        image_url: PropTypes.string,
    }

    render() {
        return (
            <>
                <Helmet>
                    <meta property="og:image" content={this.props.image_url} />
                </Helmet>

                <FacebookShareButton
                    url={this.props.url}
                    quote={this.props.quote}
                    hashtag="#quizzer"
                    className="share-items__item"
                >
                    <FacebookIcon size={50} />
                </FacebookShareButton>
            </>
        )
    }
}

export default FacebookShare
