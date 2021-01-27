import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import TextTruncate from 'react-text-truncate'
import { Link } from 'react-router-dom'
import SpinLoader from '../../loaders/SpinLoader'

class AboutUser extends Component {
    static propTypes = {
        accountUrl: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            data: {
                slug: '',
                picture: '',
                username: '',
                bio: '',
            },
        }

        this.getAccountData = this.getAccountData.bind(this)
    }

    getAccountData = () => {
        axios.get(this.props.accountUrl)
            .then(res =>
                this.setState({
                    loading: false,
                    data: {
                        slug: res.data.slug,
                        picture: res.data.picture,
                        username: res.data.username,
                        bio: res.data.bio,
                    },
                })
            )
            .catch(err =>
                this.setState({
                    loading: false,
                    data: {},
                })
            )
    }

    componentDidMount = () => this.getAccountData()

    componentDidUpdate(prevProps, _) {
        if (prevProps.accountUrl !== this.props.accountUrl)
            this.getAccountData()
    }

    render() {
        const { loading, data } = this.state

        if (loading === true)
            return <SpinLoader />

        return (
            <div className="card">
                <div className="card__body">
                    <div className="about-user">
                        <h3>{data.username}</h3>
                        <img className="img-rounded" src={data.picture} alt={data.username} />
                        {
                            data.bio ? (
                                <TextTruncate
                                    text={data.bio}
                                    element="p"
                                    line={3}
                                    truncateText="…"
                                    containerClassName="quiz-card__description"
                                />
                            ) : null
                        }
                    </div>
                </div>
                <div className="card__footer">
                    <Link to={`/profile/${data.slug}`}>
                        <button className="btn btn__submit">Check Profile</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default AboutUser
