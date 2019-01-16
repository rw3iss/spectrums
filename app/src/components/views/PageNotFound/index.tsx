import * as React from 'react';
import { Link } from 'react-router-dom';
import './style';

export default class PageNotFound extends React.Component {

   render() {
      return (
         <div className="view pagenotfound">
         	Oops! Could not find that page!

         	Go to the <Link to={'/dashboard'} className="btn">Dashboard</Link>
         </div>
      );
   }
}