import React, { Component } from 'react'
// import AdSense from 'react-adsense'

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
            // <ins className="adsbygoogle"
            //     style={{display :'block', backgroundColor: 'black'}}
            //     data-adtest="on"
            //     data-ad-client="ca-pub-0000000000000000"
            //     data-ad-slot="0000000000"
            //     data-ad-format="auto"
            //     data-full-width-responsive="true"></ins>
        );
    }
}

export default Ad