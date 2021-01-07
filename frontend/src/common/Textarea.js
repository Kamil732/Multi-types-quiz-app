import React, { useRef } from 'react'

function Textarea(props) {
    const textarea = useRef(null)
    const grippie = useRef(null)

    if (textarea.current && grippie.current) {
        let resize = false

        grippie.current.onmousedown = () => resize = true

        window.onmousemove = e => {
            if (resize === true)
                textarea.current.style.height = textarea.current.clientHeight + e.clientY - grippie.current.getBoundingClientRect().top + 'px'
        }

        window.onmouseup = () => {
            if (resize === true) {
                resize = false
                textarea.current.focus()
            }
        }
    }

    return (
        <>
            <textarea {...props} ref={textarea} />
            <div className="form-control__grippie" ref={grippie}></div>
        </>
    )
}

export default Textarea
