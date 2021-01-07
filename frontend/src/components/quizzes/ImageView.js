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

    imageUrl = debounce(() => {
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

    componentDidMount = () => this.imageUrl()

    componentDidUpdate(prevProps, _) {
        if (prevProps.image_url !== this.props.image_url)
            this.imageUrl()
    }

    render() {
        const { loading, image_url, success } = this.state

        return (
            <div className="img-preview">
                <h3>Current Image:</h3>

                {
                    loading === true ? (
                        <SpinLoader />
                    ) : (
                        <>
                            <img
                                src={image_url}
                                alt=""
                                className="img-preview__img"
                            />

                            {
                                success === false ? (
                                    <div className="error-box">
                                        <p className="error-text">The URL you entered either doesn't exist or is invalid</p>
                                    </div>
                                ) : ''
                            }
                        </>
                    )
                }
            </div>
        )
    }
}


export default ImageView