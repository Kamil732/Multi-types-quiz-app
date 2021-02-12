import React, { Component } from 'react'
import { connect } from 'react-redux'

class EditQuestions extends Component {
	render() {
		return <div>Edit Questions</div>
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(EditQuestions)
