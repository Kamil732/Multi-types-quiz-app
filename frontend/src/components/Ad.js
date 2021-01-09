import React, { Component } from 'react';

class Ad extends Component {
    // componentDidMount () {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({})
    // }

    render () {
        const image_url = 'https://fakeimg.pl/250x100/'

        return (
            <div className='ad'>
                <img src={image_url} alt="" className="ad__img" />
            </div>
        );
    }
}

export default Ad