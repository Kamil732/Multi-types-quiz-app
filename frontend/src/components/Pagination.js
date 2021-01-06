import React, { Component } from 'react'
import PropTypes from 'prop-types'
import search from '../helpers/search'
import { withRouter } from 'react-router-dom'

import queryString from 'query-string'
import ReactPaginate from 'react-paginate'

class Pagination extends Component {
    static propTypes = {
        pageCount: PropTypes.number,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    changePage = e => search(this.props, 'page', parseInt(e.selected) + 1)

    render() {
        const { pageCount } = this.props

        const query = queryString.parse(this.props.location.search)
        const initialPage = query.page - 1 || 0


        return (
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}

                initialPage={initialPage}
                breakLabel="&bull;&bull;&bull;"

                containerClassName="pagination"
                pageClassName="pagination__item"
                pageLinkClassName="pagination__link"
                previousLinkClassName="btn"
                nextLinkClassName="btn"
                disabledClassName="btn__disabled"
                activeClassName="active"

                onPageChange={this.changePage}
            />
        )
    }
}

export default withRouter(Pagination)
