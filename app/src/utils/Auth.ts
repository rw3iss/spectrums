import { hasProperties } from 'utils/js-utils'
import { cookie, store } from './Storage'
//import EventBus from 'eventbusjs'
//import UserApi from 'lib/data/api/userapi'
//import { UserStore } from 'lib/data/stores'

export default class Auth {

  /* Isomorphic / non-blocking, ie. local methods (except login) - okay refactor this */

  static isValidLogin(login) {
    return (Auth.isValidEmail(login) || Auth.isValidUsername(login))
  }

  static isValidEmail(email): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  static isValidUsername(username): boolean {
    var re = /^[a-z0-9]+$/i;
    return re.test(username);
  }

  static validateNewUser(data) {
    var errors: any = [];

    if(!hasProperties(data, ['username', 'email', 'password', 'passwordConfirm'])) {
      errors.push('Missing parameters');
      return errors;
    }

    if(data.username.length < 4) {
      errors.push('Username must be at least 4 characters long.');
    }

    if(!Auth.isValidUsername(data.username)) {
      errors.push("Username must contain only letters and numbers.");
    }

    if(!Auth.isValidEmail(data.email)) {
      errors.push('E-mail is invalid.');
    }

    if(data.password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if(data.password !== data.passwordConfirm) {
      errors.push('Passwords do not match.');
    }

    return errors;
  }

  static getToken() {
    return store('token') || cookie('token');
  }

  static logout() {
    store('token', null);
    cookie('token', null);
    store('user', null);
    cookie('user', null);
  }

  static loggedIn() {
    var token = Auth.getToken();
    return !!token;
  }

  static getCurrentUser() {
    // Todo: getCurrentUser should be defined on App Session instance
    return null;//UserStore.getCurrentUser();
  }

}
