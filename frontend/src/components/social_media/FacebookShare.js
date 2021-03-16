import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FacebookShareButton, FacebookIcon } from 'react-share'

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
					<meta property="og:type" content="website" />
					<meta property="og:image" content={this.props.image_url} />
					<meta property="og:url" content={window.location.href} />
					<meta
						property="og:title"
						content="Quizzer - The Quiz App"
					/>
					<meta
						property="og:description"
						content="The website where you can solve and create quizzes"
					/>
				</Helmet>

				<FacebookShareButton
					url={this.props.url}
					quote={this.props.quote}
					hashtag="#quizzer"
				>
					<FacebookIcon size={50} />
				</FacebookShareButton>
			</>
		)
	}
}

export default FacebookShare
