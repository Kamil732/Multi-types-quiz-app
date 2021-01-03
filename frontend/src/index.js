import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';

ReactDOM.render(
  	<React.StrictMode>
    	<App />
  	</React.StrictMode>,
  	document.getElementById('root')
);

// let prevScrollpos = window.pageYOffset;

// window.onscroll = function() {
// 	const currentScrollPos = window.pageYOffset;

// 	if (prevScrollpos > currentScrollPos) document.querySelector('.site-header').classList.remove('scroll-down')
// 	else document.querySelector('.site-header').classList.add('scroll-down')

// 	prevScrollpos = currentScrollPos;
// }