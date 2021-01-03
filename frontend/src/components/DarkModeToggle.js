import React, { Component } from 'react'

class DarkModeToggle extends Component {
    state = {
        isChecked: JSON.parse(localStorage.getItem('dark_mode'))
    }

    toggleDarkMode = () => {
        const body = document.querySelector('body')
        if (this.state.isChecked) body.classList.add('dark-mode')
        else body.classList.remove('dark-mode')
    }

    onChange = () => this.setState(prevState => ({ isChecked: !prevState.isChecked }))

    componentDidMount = () => this.toggleDarkMode()

    componentDidUpdate(_, prevState) {
        if (prevState.isChecked !== this.state.isChecked) {
            localStorage.setItem('dark_mode', this.state.isChecked)

            this.toggleDarkMode()
        }
    }

    render() {
        const { isChecked } = this.state

        return (
            <label className="dark-mode-toggle">
                <input
                    type="checkbox"
                    className="dark-mode-toggle__checkbox"
                    onChange={this.onChange}
                    checked={isChecked}
                />
                <span className="dark-mode-toggle__slider"></span>
            </label>
        )
    }
}

export default DarkModeToggle

// const mapStateToProps = (state) => ({

// })

// const mapDispatchToProps = {

// }

// export default connect(mapStateToProps, mapDispatchToProps)(DarkModeToggle)
