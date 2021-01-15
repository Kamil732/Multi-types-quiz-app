import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import SpinLoader from '../loaders/SpinLoader'

import { debounce } from 'lodash';

class ImageUrlPreview extends Component {
    static propTypes = {
        image_url: PropTypes.string.isRequired,
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
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': 'pl',
            }
        }

        const body = JSON.stringify({ image_url })

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/image-url-validation/`, body, config)

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
        if (prevProps.image_url !== this.props.image_url)
            this.setImageUrl()
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


export default ImageUrlPreview