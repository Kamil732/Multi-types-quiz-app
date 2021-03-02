import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class PsychologyAndUniversalAnswers extends Component {
	static propTypes = {
		prop: PropTypes,
	}

	render() {
		return <div>Psychology or Universal</div>
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PsychologyAndUniversalAnswers)
