import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import SpinLoader from '../loaders/SpinLoader'

import { debounce } from 'lodash'

class ImageUrlPreview extends Component {
	static propTypes = {
		image_url: PropTypes.string.isRequired,
		defaultImage: PropTypes.string,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			image_url: '',
			success: null,
		}

		this.setImageUrl = debounce(this.setImageUrl.bind(this), 500)
	}

	async setImageUrl() {
		this.setState({ loading: true })
		const { image_url } = this.props

		const config = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Accept-Language': 'pl',
			},
		}

		const body = JSON.stringify({ image_url })

		try {
			const res = await axios.post(
				`${process.env.REACT_APP_API_URL}/image-url-validation/`,
				body,
				config
			)

			this.setState({
				loading: false,
				image_url: res.data.image_url,
				success: res.data.success,
			})
		} catch (err) {
			this.setState({
				loading: false,
				image_url: '',
				success: false,
			})
		}
	}

	componentDidMount = () => this.setImageUrl()

	componentDidUpdate(prevProps, _) {
		if (prevProps.image_url !== this.props.image_url) this.setImageUrl()
	}

	render() {
		const { defaultImage } = this.props
		const { loading, success } = this.state
		let { image_url } = this.state

		if (success === false) image_url = defaultImage

		return (
			<>
				<h3>Current Image:</h3>
				<div className="img-preview">
					{loading === true ? (
						<SpinLoader />
					) : (
						<img
							src={image_url}
							alt=""
							className="img-preview__img"
						/>
					)}
				</div>
				{success === false ? (
					<div className="message-box error">
						<p className="message-box__text">
							The URL you entered either doesn't exist or is
							invalid
						</p>
					</div>
				) : null}
			</>
		)
	}
}

export default ImageUrlPreview
