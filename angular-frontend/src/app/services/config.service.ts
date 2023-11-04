import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  _profile_url: string;
  _profile_edit_url: string;
  _user_url: string;
  _api_url: string;
  _login_url: string;
  _passwordChange_url: string;
  _users_url: string;
  constructor() {
    this._api_url = 'http://localhost:8080/api';
    this._user_url = this._api_url + '/users';
    this._login_url =this._user_url + '/login';
    this._profile_url = "http://localhost:8080";
    this._passwordChange_url = this._user_url + "/changePassword";
    this._users_url = this._user_url + "/all";
    this._profile_edit_url = this._profile_url + "/edit";
  }
}
