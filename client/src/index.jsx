// Load jQuery and UIkit
import $ from 'jquery'; 
import UIkit from 'uikit'

// React
import React from 'react';
import ReactDOM from 'react-dom';
import {
		Link,
		Router,
		browserHistory,
} from 'react-router'

class App extends React.Component
{
	render()
	{
		return (
			<div>
				<div>
					<nav className="uk-navbar-container" data-uk-navbar>
						<div className="uk-navbar-left">
							<ul className="uk-navbar-nav">
								<li className="uk-active"><Link to="/">Projekt</Link></li>
								<li><Link to="/villkor">Användarvillkor</Link></li>
								<li><Link to="/om-makerfunding">Om MakerFunding.se</Link></li>
							</ul>
						</div>
					</nav>
				</div>

				<div className="uk-container uk-margin-top uk-margin-bottom">
					{this.props.children}
				</div>

				<div>
					<footer className="uk-padding-remove-horizontal">
						<div className="uk-dark uk-background-secondary uk-padding">
							<p className="uk-margin-remove-bottom">MakerFunding.se är en crowdfundingsida som drivs ideellt av Stockholm Makerspace. Copyright &copy; 2017 Christian Antila och Stockholm Makerspace</p>
						</div>
					</footer>
				</div>
			</div>
		);
	}
}

const rootRoute = {
	childRoutes: [
		{
			path: "/",
			component: App,
			indexRoute: {
				component: require("./Pages/Dashboard"),
			},
			childRoutes: [
				{
					path: "villkor",
					component: require("./Pages/Terms"),
				},
				{
					path: "om-makerfunding",
					component: require("./Pages/About"),
				},
				{
					path: "projekt/:project_id",
					component: require("./Pages/Project/Index"),
					indexRoute: {
						component: require("./Pages/Project/Project"),
					},
					childRoutes: [
						{
							path: "bidra",
							component: require("./Pages/Project/Contribute"),
						},
						{
							path: "tack",
							component: require("./Pages/Project/Receipt"),
						},
					],
				},
				{
					path: "*",
					component: require("./Pages/404"),
				},
			],
		},
	]
};

ReactDOM.render((
	<Router history={browserHistory} routes={rootRoute} />
), document.getElementById("app"));