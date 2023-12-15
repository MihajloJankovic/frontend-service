import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from '@angular/common/http';

import { ConfigService} from '../services/config.service';
import {catchError, map, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../services/api.service";
import {UserService} from "../services/user.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable, Subscription, throwError} from "rxjs";
import {LoginComponent} from "../login/login.component";
@Injectable({providedIn: 'root'})
export class AuthService {
  token:any
  getDecodedAccessToken(): any {

    this.token = localStorage.getItem('jwt');
    try {
      return this.jwtHelper.decodeToken(this.token);
      console.log(this.token)
    } catch(Error) {
      return null;
    }
  }
  get access_token(): any {
    return this._access_token;
  }

  set access_token(value: any) {
    this._access_token = value;
  }
  constructor(
    public jwtHelper: JwtHelperService,
    private apiService: ApiService,
    private userService: UserService,
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    private route: ActivatedRoute,

  ) {

  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    // Check whether the token is expired and return
    // true or false
    if(this.jwtHelper.isTokenExpired(token))
    {
      localStorage.removeItem('jwt');
      return false;
    }
    return true;
  }

  changePassword(user:any) {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    // const body = `username=${user.username}&password=${user.password}`;
    const body = {
      'email' : user.email,
      'currentPassword': user.currentPassword,
      'newPassword': user.newPassword,
    };
    return this.apiService.post(this.config._passwordChange_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE")
        {
          alert("Wrong Password")
        }else {
          console.log('Change success');
          this._access_token = null;
          localStorage.removeItem('jwt');
          let returnUrl : String;
          returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl + "/login"]);
        }
      });
  }
  private _access_token : any;

  login(user: any): Subscription {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    const body = {
      'email': user.email,
      'password': user.password,
    };

    return this.apiService.post(this.config._login_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
          console.log('Login success');
          localStorage.setItem("jwt", res.body)
          console.log(res.body)
          console.log(res)
          this.router.navigate(['/profile']);
        },
        (error) => {
          alert('Wrong credentials');

        }
      );




  }

  sendResetRequest(user: any): Subscription{
    const resetHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'email': user.email
    };

    return this.apiService.post(this.config._reset_request_url, JSON.stringify(body), resetHeaders)
    .subscribe((res) => {
      console.log('Reset request success');
      console.log(res.body)
      console.log(res)
    },(errot) => {
      alert('Wrong');
    }
    )
  }

  resetPassword(email: string, ticketReset: string, newPassword: string): Subscription {
    const resetHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'email': email,
      'ticketReset': ticketReset,
      'newPassword': newPassword
    };

    return this.apiService.post(this.config._reset_password_url, JSON.stringify(body), resetHeaders)
      .subscribe(
        (res) => {
          console.log('Reset password success');
          console.log(res.body);
          console.log(res);
          // Optionally, you can navigate to a different route after a successful password reset
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Reset password failed', error);
          // Handle error, show appropriate message to the user
        }
      );
  }

  logout(): void {
    this._access_token = null;
    localStorage.removeItem('jwt');
  }

  tokenIsPresent() {
    return this._access_token !== undefined && this._access_token !== null;
  }

  getToken() {
    return this._access_token;
  }
  getCurrentUser(): any {
    const token = localStorage.getItem('jwt');
    console.log('Token before decoding:', token);

    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded token:', decodedToken);
      return decodedToken;
    }

    console.log('No token found.');
    return null;
  }

}
