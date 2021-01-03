import React from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

import queryString from 'query-string'

class ActiveTag extends React.Component {
    static propTypes = {
        to: PropTypes.array,
        to_search: PropTypes.array,
        not_to_search: PropTypes.array,
        tag: PropTypes.string,
        className: PropTypes.string.isRequired,
        jsx: PropTypes.object,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    render() {
        const href = this.props.location.pathname
        const search = this.props.location.search

        // Check if the active URL is current URL
        let isActive = false

        if (this.props.to)
            isActive = this.props.to.some(path => href.includes(path))
        else if (this.props.to_search || this.props.not_to_search) {
            const query = queryString.parse(search)

            if (this.props.to_search)
                isActive = this.props.to_search.some(path => {
                    const [key, value] = path.split('=')

                    return value === query[key]
                })
            if (!isActive && this.props.not_to_search)
                isActive = this.props.not_to_search.some(searchKey => !(searchKey in query))
        } else
            throw Error('ActiveTag did not recive any active link. You have to send to props either "to" or "to_search"')

        // Get a tag value. If it doesn't exist then set it to Link (react-router-dom)
        const Tag = this.props.tag ? this.props.tag : Link

        // If tag is a Link (react-router-dom) then add { to: '/some-link' }, because its required for this tag
        let linkTo = Tag === Link ? { to: this.props.to[0] } : {}

        // If there's no className passed then set it empty string ''
        let className = this.props.className || ''
        className = `${className} ${isActive ? 'active' : ''}`

        return(
            <Tag className={className} {...this.props.jsx} {...linkTo}>
                {this.props.children}
            </Tag>
        )
    }
}

export default withRouter(ActiveTag)
