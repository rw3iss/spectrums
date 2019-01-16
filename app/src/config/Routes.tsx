import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Auth from 'utils/Auth';
import Home from 'components/views/Home';
import About from 'components/views/About';
import Dashboard from 'components/views/Dashboard';
import Project from 'components/views/Project';
import PageNotFound from 'components/views/PageNotFound';

function Routes() {
    return (<Switch>
		<Route exact path='/' component={Dashboard}>
			{ Auth.loggedIn() &&
				<Redirect to={{ pathname: '/dash' }}/>
			}
		</Route>
		<Route path='/about' component={About} />
		<Route path='/dash' component={Dashboard} />
		<Route path='/project/:id' component={Project} />
		<Route path='/' component={Dashboard} />
		<Route component={PageNotFound} />
    </Switch>);
}

export default Routes;