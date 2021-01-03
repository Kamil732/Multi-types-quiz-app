import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import queryString from 'query-string'

import { getQuizzes } from '../../../redux/actions/quizzes'
import SpinLoader from '../../loaders/SpinLoader'
import { withRouter } from 'react-router-dom'
import search from '../../../helpers/search'

import ActiveTag from '../../navigation/ActiveTag'

class SectionCategorySearch extends Component {
    static propTypes = {
        loading: PropTypes.bool,
        categories: PropTypes.array.isRequired,
    }

    onClick = (key, value) => {
        window.scrollTo({ top: 0, behavior: `smooth` })
        setTimeout(() => search(this.props, key, value), 1)
    }

    render() {
        const query = queryString.parse(this.props.location.search)
        const category = query.category__name

        const categories = this.props.categories.map((item, index) => (
            <ActiveTag
                tag="li"
                to_search={[`category__name=${item.name}`]}
                jsx={{ onClick: () => this.onClick('category__name', item.name) }}
                className="vertical-menu__item"
                key={index}
            >
                {item.display_name}
            </ActiveTag>
        ))

        return (
            <div className="card">
                <div className="card__header">Choose Category</div>
                <div className="card__body">
                    {
                        this.props.loading ? <SpinLoader /> : (
                            <ul className="vertical-menu">
                                <li
                                    onClick={() => this.onClick('category__name', '') }
                                    className={`vertical-menu__item ${!category ? 'active' : ''}`}
                                >
                                    All
                                </li>

                                {categories}
                            </ul>
                        )
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loading: state.quizzes.categories.loading,
    categories: state.quizzes.categories.data,
})

const mapDispatchToProps = {
    getQuizzes,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SectionCategorySearch))
