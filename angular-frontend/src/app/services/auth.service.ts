import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from '@angular/common/http';

import { ConfigService} from '../services/config.service';
import {catchError, map, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../services/api.service";
import {UserService} from "../services/user.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable} from "rxjs";
@Injectable({providedIn: 'root'})
export class AuthService {

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
      localStorage.clear();
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
      'currentPassword': user.currentPassword,
      'newPassword': user.newPassword,
      'confirmPassword': user.confirmPassword
    };
    return this.apiService.post(this.config._passwordChange_url, JSON.stringify(body), loginHeaders)
      .subscribe((res) => {
        if(res.body == "NOT_ACCEPTABLE")
        {
          alert("Wrong Password")
        }else {
          console.log('Change success');
          let returnUrl : String;
          returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl + "/login"]);
        }
      });
  }
  private _access_token = null;

  login(user: any): Observable<any> {
    const loginHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.config._login_url, user, { headers: loginHeaders })
      .pipe(
        tap(response => {
          this._access_token = response.headers.get('jwt');
          localStorage.setItem('jwt', response.jwt);
        })
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
}
