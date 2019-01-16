import { store, cookie } from 'utils/Storage'
import { UserApi } from 'data/api';

export default class UserStore {
   user: any = null;
   token: any = null;

   constructor() {
      this.user = null;
   }

   setCurrentUser(user, token = null) {
      this.user = user;
      cookie('user', user);
      store('user', user);

      if (token) {
         this.token = token;
         cookie('token', token);
         store('token', token);
      }
   }

   getCurrentUser() {
      if (this.user) return this.user;
      var user = cookie('user') || store('user');
      return this.user = user ? JSON.parse(user) : null;
   }

}