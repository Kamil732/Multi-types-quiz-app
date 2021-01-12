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
        sections: PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    onClick = (key, value) => {
        window.scrollTo({ top: 0, behavior: `smooth` })
        search(this.props, key, value)
    }

    render() {
        const query = queryString.parse(this.props.location.search)
        const section = query.section__name

        const sections = this.props.sections.map((item, index) => (
            <ActiveTag
                tag="li"
                to_search={[`section__name=${item.name}`]}
                jsx={{ onClick: () => this.onClick('section__name', item.name) }}
                className='vertical-menu__item'
                key={index}
            >
                {item.display_name}
            </ActiveTag>
        ))

        return (
            <div className="card">
                <div className="card__header">Choose Section</div>
                <div className="card__body">
                        {
                            this.props.loading ? <SpinLoader /> : (
                                <ul className="vertical-menu">
                                    <li
                                        onClick={() => this.onClick('section__name', '') }
                                        className={`vertical-menu__item ${!section ? 'active' : ''}`}
                                    >
                                        All
                                    </li>

                                    {sections}
                                </ul>
                            )
                        }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    loading: state.quizzes.sections.loading,
    sections: state.quizzes.sections.data,
})

const mapDispatchToProps = {
    getQuizzes,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SectionCategorySearch))
