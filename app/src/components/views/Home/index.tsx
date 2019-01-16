import * as React from 'react';
import './style';

export default class Home extends React.Component {

   componentWillUnmount() {
      // Remember state for the next mount
   }

   render() {
      return (
         <div className="view home">Spectrums</div>
      );
   }
}