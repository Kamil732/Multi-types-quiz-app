import React, { Component } from 'react'

class Textarea extends Component {
	constructor(props) {
		super(props)

		this.textarea = React.createRef()
		this.grippie = React.createRef()
		this.resize = false

		this.onMouseMove = this.onMouseMove.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this)
	}

	onMouseMove(e) {
		if (this.resize === true)
			this.textarea.current.style.height =
				this.textarea.current.clientHeight +
				e.clientY -
				this.grippie.current.getBoundingClientRect().top +
				'px'
	}

	onMouseUp() {
		if (this.resize === true) {
			this.resize = false
			this.textarea.current.focus()
		}
	}

	value = () => this.textarea.current.value

	componentDidMount() {
		this.grippie.current.onmousedown = () => (this.resize = true)
		window.addEventListener('mousemove', this.onMouseMove)
		window.addEventListener('mouseup', this.onMouseUp)
	}

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.onMouseMove)
		window.removeEventListener('mouseup', this.onMouseUp)
	}

	render() {
		return (
			<>
				<textarea {...this.props} ref={this.textarea} />
				<div className="form-control__grippie" ref={this.grippie}></div>
			</>
		)
	}
}

export default Textarea
