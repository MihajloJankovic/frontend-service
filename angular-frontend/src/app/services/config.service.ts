import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  _api_url: string;

  // Profile Endpoints
  _profile_url: string;
  _profile_edit_url: string;

  // User Endpoints
  _login_url: string;
  _passwordChange_url: string;

  // Accommodation Endpoints
  _accommodation_url: string;
  _accommodations_url: string;
  _filtered_accommodations_url: string;
  _addAccommodation_url: string;
  _updateAccommodation_url: string;

  // Auth Endpoints
  _register_url: string;
  _getTicket_url: string;
  _activate_url: string;
  _reset_request_url: string;
  _reset_password_url: string;

  // Availability Endpoints
  _setAvailability_url: string;
  _getAllAvailability_url: string;
  _checkAvailability_url: string;
  _reservation_url: string;
  _avaibility_set_url: string;


  constructor() {
    this._api_url = 'http://localhost:9090'; // Adjust the port as needed

    // Profile Endpoints
    this._profile_url = this._api_url + '/profile';
    this._profile_edit_url = this._api_url + '/update-profile';
    this._reservation_url = this._api_url + '/set-reservation';

    // User Endpoints
    this._login_url = this._api_url + '/login';
    this._passwordChange_url = this._api_url + '/change-password';

    // Accommodation Endpoints
    this._accommodation_url = this._api_url + '/accomondation-one';
    this._accommodations_url = this._api_url + '/accommodations';
    this._filtered_accommodations_url = this._api_url + '/filtered_accommodations';
    this._addAccommodation_url = this._api_url + '/add-accommodation';
    this._updateAccommodation_url = this._api_url + '/update-accommodation';
    this._avaibility_set_url = this._api_url + "/set-avaibility";
    // Auth Endpoints
    this._register_url = this._api_url + '/register';
    this._getTicket_url = this._api_url + '/getTicket';
    this._activate_url = this._api_url + '/activate';
    this._reset_request_url = this._api_url + '/request-reset';
    this._reset_password_url = this._api_url + '/reset';

    // Availability Endpoints
    this._setAvailability_url = this._api_url + '/set-availability';
    this._getAllAvailability_url = this._api_url + '/get-all-availability';
    this._checkAvailability_url = this._api_url + '/check-availability';
  }
}
