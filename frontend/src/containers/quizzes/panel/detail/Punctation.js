import axios from 'axios'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class Punctation extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			data: [],
		}

		this.getPunctations = this.getPunctations.bind(this)
	}

	getPunctations = () => {
		this.setState({ loading: true })
		const { data } = this.props

		axios
			.get(
				`${process.env.REACT_APP_API_URL}/quizzes/${data.author_slug}/${data.slug}/punctation/`
			)
			.then((res) =>
				this.setState({
					loading: false,
					data: res.data,
				})
			)
			.catch((err) =>
				this.setState({
					loading: false,
					data: [],
				})
			)
	}

	render() {
		return <div></div>
	}
}

export default Punctation
