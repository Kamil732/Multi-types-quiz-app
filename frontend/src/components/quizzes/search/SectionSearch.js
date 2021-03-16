import React, { Component } from 'react'
import { connect } from 'react-redux'

import queryString from 'query-string'

import { getQuizzes } from '../../../redux/actions/quizzes'
import { withRouter } from 'react-router-dom'
import search from '../../../helpers/search'

import ActiveTag from '../../navigation/ActiveTag'

class SectionSearch extends Component {
	constructor(props) {
		super(props)

		this.onClick = this.onClick.bind(this)
	}

	onClick = (key, value) => {
		window.scrollTo({ top: 0, behavior: `smooth` })
		setTimeout(search(this.props, key, value), 150)
	}

	render() {
		const query = queryString.parse(this.props.location.search)
		const section = query.section

		const sections = [
			{
				name: 'knowledge_quiz',
				display_name: 'Knowledge Quiz',
			},
			{
				name: 'universal_quiz',
				display_name: 'Universal Quiz',
			},
			{
				name: 'psychology_quiz',
				display_name: 'Psychology Quiz',
			},
			{
				name: 'preferential_quiz',
				display_name: 'Preferential Quiz',
			},
		].map((item, index) => (
			<ActiveTag
				tag="li"
				to_search={[`section=${item.name}`]}
				jsx={{
					onClick: () => this.onClick('section', item.name),
				}}
				className="vertical-menu__item"
				key={index}
			>
				{item.display_name}
			</ActiveTag>
		))

		return (
			<div className="card">
				<div className="card__header">Choose Section</div>
				<div className="card__body">
					<ul className="vertical-menu">
						<li
							onClick={() => this.onClick('section', '')}
							className={`vertical-menu__item ${
								!section ? 'active' : ''
							}`}
						>
							All
						</li>

						{sections}
					</ul>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = {
	getQuizzes,
}

export default connect(null, mapDispatchToProps)(withRouter(SectionSearch))
