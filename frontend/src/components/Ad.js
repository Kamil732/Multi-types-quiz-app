import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import AdSense from 'react-adsense'

class Ad extends Component {
	googleInit = null

	static propTypes = {
		className: PropTypes.string,
		slot: PropTypes.string,
		timeout: PropTypes.number,
	}

	static defaultProps = {
		classNames: '',
		timeout: 200,
	}

	componentDidMount() {
		const { timeout } = this.props

		this.googleInit = setTimeout(() => {
			if (typeof window !== 'undefined')
				(window.adsbygoogle = window.adsbygoogle || []).push({})
		}, timeout)
	}

	componentWillUnmount() {
		if (this.googleInit) clearTimeout(this.googleInit)
	}

	render() {
		const { className, slot } = this.props

		return (
			<div className={className}>
				<ins
					className="adsbygoogle"
					style={{ display: 'block', backgroundColor: '#eee' }}
					data-ad-client={process.env.REACT_APP_GOOGLE_ADSENSE_ID}
					data-ad-slot={slot}
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
			</div>
		)
	}
}

export default Ad
