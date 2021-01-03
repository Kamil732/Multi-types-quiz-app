import React, { Component } from 'react';
import '../assets/css/main.css'
import { BrowserRouter as Router } from 'react-router-dom'

import store from '../redux/store'
import { Provider } from 'react-redux'
import { loadUser } from '../redux/actions/auth'

import Header from '../containers/Header'
import Routes from './Routes'
import Footer from '../containers/Footer'
import { getCategorySection } from '../redux/actions/quizzes';

class App extends Component {
	componentDidMount() {
		store.dispatch(loadUser())
		store.dispatch(getCategorySection())
		document.getElementById('page-loader').remove()
	}

	render() {
		return (
			<Provider store={store}>
				<Router>
					<Header />

					<div className="content-wrap container-mobile">
						<Routes />
					</div>

					<Footer />
				</Router>
			</Provider>
		)
	}
}

export default App;
