//import 'react-hot-loader/patch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'components/shared/App';
import { HashRouter, withRouter } from 'react-router-dom';

const AppWithRouter = withRouter(props => <App {...props} />);

ReactDOM.render(
    <HashRouter>
      <AppWithRouter />
    </HashRouter>,
  document.getElementById('root')
);
