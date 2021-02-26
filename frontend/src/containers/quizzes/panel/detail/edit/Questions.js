import React, { Component } from 'react'
import { connect } from 'react-redux'

class Questions extends Component {
	render() {
		return <div>Edit Questions</div>
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
