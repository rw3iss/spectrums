import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import auth from 'utils/Auth';

class AuthorizedComponent extends React.Component {

   componentWillMount() {
      if (!auth.loggedIn()) {
         browserHistory.push('/login');
         //EventBus.dispatch('APP_NEEDS_LOGIN');
      }
   }
   
}

export default AuthorizedComponent;