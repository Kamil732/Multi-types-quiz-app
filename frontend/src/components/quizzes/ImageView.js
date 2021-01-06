import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import SpinLoader from '../loaders/SpinLoader'

import { debounce } from 'lodash';

class ImageView extends Component {
    static propTypes = {
        image_url: PropTypes.string.isRequired,
    }

    state = {
        loading: null,
        image_url: '',
        success: null,
    }

    getImageUrl = debounce(() => {
        this.setState({ loading: true })
        const { image_url } = this.props

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': 'pl',
            }
        }

        const body = JSON.stringify({ image_url })

        axios.post('http://192.168.1.31:8000/api/image-url-validation/', body, config)
            .then(res => this.setState({
                loading: false,
                image_url: res.data['image_url'],
                success: res.data['success'],
            }))
    }, 500)

    onClick = e => {
        e.preventDefault()
        this.getImageUrl()
    }

    componentDidUpdate(prevProps, _) {
        if (prevProps.image_url !== this.props.image_url)
            this.getImageUrl()
    }

    render() {
        const { loading, image_url, success } = this.state

        return (
            <div className="image-view">
                <h5>Current Image:</h5>
                <button className="btn" onClick={this.onClick}>Refresh</button>

                {
                    loading === true ? (
                        <SpinLoader />
                    ) : (
                        <img
                            src={image_url}
                            alt=""
                        />
                    )
                }

                {
                    success === false ? (
                        <div>Error</div>
                    ) : ''
                }
            </div>
        )
    }
}


export default ImageView



// import React, { Component } from 'react'
// import PropTypes from 'prop-types'

// class ImageView extends Component {
//     static propTypes = {
//         image_url: PropTypes.string.isRequired,
//     }

//     getImageUrl = image_url => {
//         var image = new Image()
//         image.src = image_url

//         return image.width > 0 ? image_url : 'https://cdn.pixabay.com/photo/2017/01/24/00/21/question-2004314_960_720.jpg'
//     }

//     render() {
//         const image_url = this.getImageUrl(this.props.image_url)

//         return (
//             <div className="image-view">
//                 <h5>Current Image:</h5>

//                 <img src={image_url} alt="" />
//             </div>
//         )
//     }
// }



// export default ImageView
